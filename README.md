# to-do-app
To-Do app using AWS services for user management (authentication, authorization, and accounting (AAA) mechanisms) and deployment.

## AWS cli helpful commands for cognito
- aws cognito-idp sign-up --client-id hf90tv2s5rfo6eld1i7umhajb --username 'email@gmail.com' --password 'password'
- aws cognito-idp confirm-sign-up --client-id 1gleav19hr5b64lmb6gfe2rdal --username 'email@gmail.com' --confirmation-code 216620
- aws cognito-idp initiate-auth --client-id hf90tv2s5rfo6eld1i7umhajb --auth-flow USER_PASSWORD_AUTH --auth-parameters 'USERNAME=emailgmail.com,PASSWORD=password'
- curl 'https://965cvkw509.execute-api.eu-west-1.amazonaws.com/health' -H 'Authorization: Bearer eyJraW...'

## Future work
- Use lambda function that's triggered in the signup process
