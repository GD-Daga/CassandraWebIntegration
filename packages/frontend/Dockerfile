# Step 1: Use an official Node.js image to build the React app
FROM node:16 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the React app
RUN npm run build

# Step 2: Use an Nginx image to serve the built files
FROM nginx:1.21

# Copy the built React files to the Nginx web root
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration file if needed (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]