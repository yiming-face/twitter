/*
const password = '12345678';
const name = 'test';
const email = 'test@facedao.pro';
const cognito = new AWS.CognitoIdentityServiceProvider();

const username = 'c0e2ddd6-488d-4d57-b612-0f593b28d77e';

const clientId = '1norsk3k2q2v6j0o82n8us94rf';

const auth = await cognito.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
        USERNAME: username,
        PASSWORD: password
    }
}).promise();

const param = {
    IdentityPoolId: 'us-east-1:43b391a2-6531-46f6-a1fe-82dc7c40739c',
    Logins: {
        // The identifier name you set at Step 2
        [`magic.link`]: issuer
    },
    TokenDuration: 3600 // expiration time of connected id token
};

// Retrieve OpenID Connect Token
const result = await cognitoidentity
    .getOpenIdTokenForDeveloperIdentity(param)
    .promise();

const response = {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods':
            'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'
    },
    body: {
        ...result, username,
        name,
        email,
        idToken: auth.AuthenticationResult.IdToken,
        accessToken: auth.AuthenticationResult.AccessToken
    }
};


 */
