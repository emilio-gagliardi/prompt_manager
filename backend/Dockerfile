FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /backend

# Copy the requirements file and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
COPY backend/ .

# Ensure the .env.docker file is included in the container
COPY backend/.env.docker .

# Expose the port the app will run on
EXPOSE 7070

# Set environment variable to indicate it's running in Docker
ENV APP_ENV=docker

# Start the FastAPI app using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7070"]
