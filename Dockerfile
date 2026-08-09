FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Remove .env (use environment variables instead)
RUN rm -f .env

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]