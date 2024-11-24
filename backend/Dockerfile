# Use the official Python image as the base image
FROM --platform=linux/amd64 python:3.12-alpine

# Set the working directory
WORKDIR /app

# Copy the requirements.txt file and install dependencies
COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -r requirements.txt && \
    apk --no-cache add curl

# Copy the FastAPI application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Run the FastAPI application using Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
