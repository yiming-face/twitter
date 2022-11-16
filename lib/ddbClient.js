const AWS = require('aws-sdk');
const dt = require('./dt');
const l = require('./log');

const docClient = new AWS.DynamoDB.DocumentClient();

const basicParams = ({tableName, primaryKey}, pkey) => ({
  TableName: tableName,
  Key: {
    [primaryKey]: pkey
  }
});

const consistentReadParams = (tableConfig, pkey) => ({
  ...basicParams(tableConfig, pkey),
  ConsistentRead: true
});

const scanParams = (tableConfig, conditions, operator) => ({
  TableName: tableConfig['tableName'],
  FilterExpression: Object.keys(conditions)
    .map(key => `${key} = :${key}`)
    .join(` ${operator} `),
  ExpressionAttributeValues: Object.keys(conditions).reduce(
    (accum, key) => ({...accum, [`:${key}`]: conditions[key]}),
    {}
  )
});

const scanCountParams = (tableConfig, conditions, operator) => ({
  TableName: tableConfig['tableName'],
  FilterExpression: Object.keys(conditions)
    .map(key => `${key} = :${key}`)
    .join(` ${operator} `),
  ExpressionAttributeValues: Object.keys(conditions).reduce(
    (accum, key) => ({...accum, [`:${key}`]: conditions[key]}),
    {}
  ),
  Select: 'COUNT'
});

const addAttrParams = (tableConfig, pkey, updates) => {
  let params = {
    ...basicParams(tableConfig, pkey),
    UpdateExpression:
      'set ' +
      Object.keys(updates)
        .map(key => `${key} = :${key}`)
        .join(','),
    ExpressionAttributeValues: Object.keys(updates).reduce(
      (accum, key) => ({...accum, [`:${key}`]: updates[key]}),
      {}
    )
  };
  params.ts = dt.isoDateTimeString();
  return params;
};

const removeAttrParams = (tableConfig, pkey, params) => ({
  ...basicParams(tableConfig, pkey),
  UpdateExpression: 'remove ' + params.join(', ')
});

const createAttrParams = (tableConfig, pkey, columns) => ({
  ...basicParams(tableConfig, pkey),
  Item: {
    ...columns,
    [tableConfig.primaryKey]: pkey
  }
});

const scanItemCond = (tableConfig, conditions, operator = 'AND') =>
  docClient.scan(scanParams(tableConfig, conditions, operator)).promise();

const getItemCount = (tableConfig, conditions, operator) =>
  docClient.scan(scanCountParams(tableConfig, conditions, operator)).promise();

const scanItem = (params) =>
  docClient.scan(params).promise();

const getItem = (tableConfig, pkey) =>
  docClient.get(consistentReadParams(tableConfig, pkey)).promise();

const updateItem = (tableConfig, pkey, updates) => {
  updates.ts = dt.isoDateTimeString();
  let params = addAttrParams(tableConfig, pkey, updates);
  l.d('params:', JSON.stringify(params));
  return docClient.update(params).promise();
};

const removeAttributes = (tableConfig, pkey, params) =>
  docClient.update(removeAttrParams(tableConfig, pkey, params)).promise();

const deleteItem = (tableConfig, pkey) =>
  docClient.delete(basicParams(tableConfig, pkey)).promise();

const createItem = (tableConfig, pkey, columns, options) => {
  if (options.withTtlSeconds !== undefined) {
    columns = {
      ...columns,
      ts: dt.isoDateTimeString(),
      [options.withTtlSeconds.key]: dt.getExpirationTs(options.withTtlSeconds.value)
    };
  }
  let params = createAttrParams(tableConfig, pkey, columns);
  if (options.ifNotExists === true) {
    params.ConditionExpression = `attribute_not_exists(${tableConfig.primaryKey})`;
  }
  l.d('create item params:', JSON.stringify(params));
  return docClient.put(params).promise();
};

module.exports = {
  scanItemCond,
  getItemCount,
  scanItem,
  getItem,
  updateItem,
  removeAttributes,
  deleteItem,
  createItem
};
