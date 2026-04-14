FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Start the Vite dev server
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]