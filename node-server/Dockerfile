# node-server/Dockerfile
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the server port
EXPOSE 4000

# Command to run the server
CMD ["node", "server.js"]
