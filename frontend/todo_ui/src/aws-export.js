// src/aws-exports.js
const awsConfig = {
  Auth: {
    Cognito: {
      // REQUIRED - Amazon Cognito Region
      region: process.env.REACT_APP_REGION,

      // Amazon Cognito User Pool ID
      userPoolId: process.env.REACT_APP_USER_POOL_ID,

      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,

      // Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

      loginWith: {
        oauth: {
          domain: process.env.REACT_APP_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [`${process.env.REACT_APP_FRONTEND_URL}/reminders`],
          redirectSignOut: [`${process.env.REACT_APP_FRONTEND_URL}/`],
          responseType: 'code', // or 'token', 'code' for Authorization code grant
        },
        email: 'true', // Optional
      }
    }
  }
};

export default awsConfig;
