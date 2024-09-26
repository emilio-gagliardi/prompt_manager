FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /backend

# Install curl for health checks
RUN apt-get update && apt-get install -y curl

# Copy the requirements file from the root directory and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend code
COPY . .

# Expose the port the app will run on
EXPOSE 7070

# Set environment variable to indicate it's running in Docker
ENV APP_ENV=docker

# Start the FastAPI app using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7070"]
