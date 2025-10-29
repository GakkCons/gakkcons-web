# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the rest of the application code
COPY . .

# Install dependencies
# Use npm cache located at /tmp/.npm and node_modules cache at /tmp/.node
RUN --mount=type=cache,target=/tmp/.npm \
    --mount=type=cache,target=/tmp/.node \
    npm ci --save-dev --cache /tmp/.npm --prefer-offline

RUN npm i -g serve
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000