# Use an official Python runtime as a parent image
FROM python:3.11.8

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Copy the environment file
ARG ENVIRONMENT=development
COPY .env.${ENVIRONMENT} .env

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Ensure Gunicorn is installed
RUN pip install gunicorn

# Copy entrypoint script and make it executable
COPY entrypoint.sh /usr/src/app
RUN chmod +x /usr/src/app/entrypoint.sh

# Debug: List files and their permissions
RUN ls -la /usr/src/app/

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_APP=app

# Use the entrypoint script to run migrations and then start the Flask application
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "wsgi:app"]
