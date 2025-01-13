# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run dev

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Set the command to run the app
CMD ["serve", "-s", "src"]

# Expose the port the app runs on
EXPOSE 5000