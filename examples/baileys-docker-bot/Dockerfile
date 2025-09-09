FROM node:20-alpine

WORKDIR /app

# Install only production deps first for better layer caching
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy app source
COPY . .

ENV NODE_ENV=production
# Baileys multi-file auth directory
ENV BAILEYS_AUTH_DIR=/app/auth

# Persist auth between restarts
VOLUME ["/app/auth"]

CMD ["node", "index.js"]