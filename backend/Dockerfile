# Use the official Python image as the base image
FROM --platform=linux/amd64 python:3.12-alpine

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file and install dependencies
COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt && \
    apk --no-cache add curl

# Set build-time arguments
ARG REGION
ARG USER_POOL_ID
ARG CLIENT_ID
ARG FRONTEND_URL

# Set environment variables
ENV REGION=${REGION}
ENV USER_POOL_ID=${USER_POOL_ID}
ENV CLIENT_ID=${CLIENT_ID}
ENV FRONTEND_URL=${FRONTEND_URL}

# Copy the FastAPI application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
