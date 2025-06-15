FROM node:18

# yt-dlp install
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip install yt-dlp

# Copy app files
WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

# Run the server
CMD ["npm", "start"]
