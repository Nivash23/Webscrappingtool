# Use the official Node.js image from Docker Hub
FROM node:16

# Install the necessary dependencies for Playwright (required libraries for the browsers)
RUN apt-get update && apt-get install -y \
  wget \
  curl \
  ca-certificates \
  libx11-dev \
  libxcomposite1 \
  libxrandr2 \
  libgdk-pixbuf2.0-0 \
  libgbm1 \
  libasound2 \
  libnss3 \
  libatk-bridge2.0-0 \
  libgtk-3-0 \
  libxss1 \
  libxtst6 \
  libnss3-dev \
  fonts-liberation \
  libappindicator3-1 \
  libdbusmenu-gtk4 \
  xdg-utils \
  --no-install-recommends

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Install Playwright browsers (chromium, etc.)
RUN npx playwright install --with-deps

# Expose port 3000 (or whichever port your app uses)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
