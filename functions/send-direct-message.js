const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient();
const ulid = require('ulid');
const l = require('../lib/log');

const { CONVERSATIONS_TABLE, DIRECT_MESSAGES_TABLE } = process.env;

module.exports.handler = async (event) => {
  l.i('>>> REQ <<<', event);

  const { otherUserId, message } = event.arguments;
  const { username } = event.identity.resolverContext;
  const timestamp = new Date().toJSON();

  const conversationId = username < otherUserId
    ? `${username}_${otherUserId}`
    : `${otherUserId}_${username}`;

  await DocumentClient.transactWrite({
    TransactItems: [{
      Put: {
        TableName: DIRECT_MESSAGES_TABLE,
        Item: {
          conversationId,
          messageId: ulid.ulid(),
          message,
          from: username,
          timestamp,
        },
      },
    }, {
      Update: {
        TableName: CONVERSATIONS_TABLE,
        Key: {
          userId: username,
          otherUserId
        },
        UpdateExpression: 'SET id = :id, lastMessage = :lastMessage, lastModified = :now',
        ExpressionAttributeValues: {
          ':id': conversationId,
          ':lastMessage': message,
          ':now': timestamp,
        },
      },
    }, {
      Update: {
        TableName: CONVERSATIONS_TABLE,
        Key: {
          userId: otherUserId,
          otherUserId: username,
        },
        UpdateExpression: 'SET id = :id, lastMessage = :lastMessage, lastModified = :now',
        ExpressionAttributeValues: {
          ':id': conversationId,
          ':lastMessage': message,
          ':now': timestamp,
        },
      },
    }]
  }).promise();


  let rsp = {
    id: conversationId,
    otherUserId,
    lastMessage: message,
    lastModified: timestamp,
  };
  l.i('>>> RSP <<<', rsp);

  return rsp;
};
