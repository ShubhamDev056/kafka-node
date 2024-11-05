# react-client/Dockerfile
FROM node:20 as build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight server to serve the React app
FROM nginx:alpine

# Copy the build files to the NGINX server
COPY --from=build /app/build /usr/share/nginx/html

# Expose the server port
EXPOSE 80

# Command to run the NGINX server
CMD ["nginx", "-g", "daemon off;"]
