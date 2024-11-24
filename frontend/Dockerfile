# Use the official Node.js runtime as the base image
FROM node:18 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY todo_ui/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY todo_ui/ .

# Build the React app for production
RUN REACT_APP_REGION='eu-west-1' \
    REACT_APP_USER_POOL_ID='eu-west-1_7GnxkjJTp' \
    REACT_APP_USER_POOL_CLIENT_ID='2rboagge3tq8c6r3igp01ehtgd' \
    REACT_APP_COGNITO_DOMAIN='todo-auth-domain.auth.eu-west-1.amazoncognito.com' \ 
    REACT_APP_BACKEND_URL='http://localhost:8000' \ 
    REACT_APP_FRONTEND_URL='http://localhost:3000' \ 
    npm run build

# Use Nginx as the production server
FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80
