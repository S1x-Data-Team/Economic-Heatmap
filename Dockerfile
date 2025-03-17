# Use official Node.js image as base
FROM node:22

# Set working directory in container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app's code
COPY . .

# Expose the app's port
EXPOSE 3420

# Start the server
CMD ["node", "server.js"]