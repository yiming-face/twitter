'use strict';

let Code = {};
const MSG = {};
Code.OK = 1000;
MSG[Code.OK] = 'OK';
Code.Unknown = 11000;
MSG[Code.Unknown] = 'Unknown error';
Code.NoRoute = 11001;
MSG[Code.NoRoute] = 'No proper route';
Code.InvalidParameter = 11002;
MSG[Code.InvalidParameter] = 'Invalid parameter';
Code.NoData = 11003;
MSG[Code.NoData] = 'No info found';
Code.DupAccount = 11004;
MSG[Code.DupAccount] = 'The same account already exists';
Code.DupEmail = 11005;
MSG[Code.DupEmail] = 'The same email address already exists';
Code.DupCode = 11006;
MSG[Code.DupCode] = 'The same smile code already exists';
Code.ExpiredLogin = 11007;
MSG[Code.ExpiredLogin] = 'Login expired';
Code.InvalidToken = 11008;
MSG[Code.InvalidToken] = 'Invalid token';
Code.EmailUnmatch = 11009;
MSG[Code.EmailUnmatch] = 'Unmatched email';

Code.toString = function (errId) {
  let msg = MSG[Code.Unknown];
  if (errId in MSG) {
    msg = MSG[errId];
  }
  return msg;
};

module.exports = {
  Code
};
