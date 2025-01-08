# Use official Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy the documentation files to the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir mkdocs-material

# Expose the MkDocs default port
EXPOSE 8000

# Command to run MkDocs server
CMD ["mkdocs", "serve", "-a", "0.0.0.0:8000"]
