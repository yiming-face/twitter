const l = require('../lib/log');

exports.handler = async (event) => {
  l.d('>>> REQ <<<', event);

  const {
    authorizationToken,
    requestContext
  } = event;

  const resp = {
    isAuthorized: true,
    resolverContext: {
      username: 'c0e2ddd6-488d-4d57-b612-0f593b28d77e',
    },

    ttlOverride: 10,
  };

  l.i('>>> RSP <<<', resp)

  return resp;
}
