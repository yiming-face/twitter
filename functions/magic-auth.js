const AWS = require('aws-sdk');
const {Magic} = require('@magic-sdk/admin');
const l = require('../lib/log');

const {
  MAGIC_PUB_KEY
} = process.env;

exports.handler = async (event) => {
  l.d('>>> REQ <<<', event);
  l.d('env:', process.env);

  const {
    idToken,
    email
  } = event.arguments;

  const magic = new Magic(MAGIC_PUB_KEY);

  try {
    let res = magic.token.validate(idToken);
    l.d('res:', res);
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods':
          'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
      },
      body: {

      }
    };
    return response;
  } catch (error) {
    l.e(error.message);
    const response = {
      statusCode: 500,
      body: JSON.stringify(error.message),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods':
          'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
      }
    };
    return response;
  }
};
