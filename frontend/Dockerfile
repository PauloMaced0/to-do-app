# Use the official Nginx image as the base image
FROM nginx:alpine

# Copy index.html file into the default directory for Nginx
COPY src/* /usr/share/nginx/html/

# Copy custom Nginx configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
