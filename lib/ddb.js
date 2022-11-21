const chance = require('chance').Chance();
const l = require('./log');
const dt = require('./dt');
const ddbClient = require('./ddbClient');
const {genUserName} = require('./helpers');
const {genSmileCode} = require('./helpers');
const {uuid} = require('./helpers');

const USERS_TABLE = process.env.USERS_TABLE;

const userTableConfig = {
  tableName: USERS_TABLE,
  primaryKey: 'id'
};

const createUser = (email) => {
  const userName = genUserName();
  const columns = {
    email,
    createdAt: new Date().toJSON(),
    followersCount: 0,
    followingCount: 0,
    tweetsCount: 0,
    likesCount: 0,
    smileCode: genSmileCode(),
    userName: userName,
    nickName: userName
  };
  const options = {
    ifNotExists: true
  };

  l.i('User columns:', JSON.stringify(columns));
  return ddbClient.createItem(userTableConfig, uuid(), columns, options).catch(error => {
    l.e(error);
  });
};

const updateUser = (userId, name) => {
  const suffix = chance.string({
    length: 8,
    casing: 'upper',
    alpha: true,
    numeric: true
  });

  return ddbClient.updateItem(userTableConfig, userId, {
    name,
    screenName: `${name.replace(/[^a-zA-Z0-9]/g, '')}${suffix}`
  });
};

const getUserById = userId => ddbClient.getItem(userTableConfig, userId).then(user => {
  if (user.Item) {
    return user.Item;
  }
  return null;
});

const getUserByEmail = async email => {
  let conditions = {
    email
  };
  let ret = await ddbClient.scanItemCond(userTableConfig, conditions, 'AND');
  if (ret.Count <= 0) {
    return null;
  }
  return ret.Items[0];
};

module.exports = {
  createUser,
  updateUser,
  getUserById,
  getUserByEmail
};
