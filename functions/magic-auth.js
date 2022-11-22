const AWS = require('aws-sdk');
const {Magic} = require('@magic-sdk/admin');
const l = require('../lib/log');
const ddb = require('../lib/ddb');
const {Code} = require('../lib/code');
const {Result} = require('../lib/result');
const jwt = require('../lib/jwt');
const helpers = require('../lib/helpers');

const {MAGIC_SEC_KEY} = process.env;

exports.handler = async (event) => {
  l.d('>>> REQ <<<', event);
  l.d('env:', process.env);

  const {didToken, email} = JSON.parse(event.body);

  const magic = new Magic(MAGIC_SEC_KEY);

  let rsp = Result.error(Code.InvalidToken);

  do {
    try {
      magic.token.validate(didToken);

      const metadata = await magic.users.getMetadataByToken(didToken);
      l.i('meta:', metadata);

      if (!metadata || metadata.email !== email) {
        rsp = Result.error(Code.EmailUnmatch);
        l.e('email not match:', metadata.email, email);
        break;
      }

      let user = await ddb.getUserByEmail(email);
      if (!user) {
        user = await ddb.createUser(email);
      }

      // Fix user profile
      {
        if (!user.userName) {
          user.userName = helpers.genUserName();
          user.nickName = user.userName;

          ddb.updateUser(user.id, user);
        }
      }

      let token = await jwt.sign({userId: user.id});

      rsp = Result.success({...user, token});
    } catch (error) {
      l.e(error.message);
      break;
    }
  } while (0);

  l.d('>>> RSP <<<', rsp);
  return rsp;
};
