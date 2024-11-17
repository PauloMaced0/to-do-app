// src/aws-exports.js
const awsConfig = {
  Auth: {
    Cognito: {
      // REQUIRED - Amazon Cognito Region
      region: 'eu-west-1',

      // Amazon Cognito User Pool ID
      userPoolId: 'eu-west-1_p24nkrTHJ',

      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: '7a1cvnev9bed4orv2500ibrae4',

      identityPoolId: 'eu-west-1:735a5596-eb68-499f-b270-70f5f36b8cd5',

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
        username: 'true',
        email: 'true', // Optional
      }
    }
  }
};

export default awsConfig;
