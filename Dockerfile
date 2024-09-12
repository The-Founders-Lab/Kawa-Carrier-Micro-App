# Base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Copy the .env
COPY .env ./

# Creates a "dist" folder with the production build
# RUN npm run build

# Expose the port on which the app will run
EXPOSE 8842

# Start the server using the production build
# CMD ["npm", "run", "start:prod"]
