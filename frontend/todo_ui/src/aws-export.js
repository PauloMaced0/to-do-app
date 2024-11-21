// src/aws-exports.js
const awsConfig = {
  Auth: {
    Cognito: {
      // REQUIRED - Amazon Cognito Region
      region: 'eu-west-1',

      // Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_7GnxkjJTp',

      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: '2rboagge3tq8c6r3igp01ehtgd',

      // identityPoolId: 'eu-west-1:c3fbe446-0655-4812-a342-8645518594c4',

      // Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

      loginWith: {
        oauth: {
          domain: 'todo-auth-domain.auth.eu-west-1.amazoncognito.com',
          scopes: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'],
          redirectSignIn: ['http://localhost:3000/reminders'],
          redirectSignOut: ['http://localhost:3000/'],
          responseType: 'code', // or 'token', 'code' for Authorization code grant
        },
        email: 'true', // Optional
      }
    }
  }
};

export default awsConfig;
