FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Add this before the build step to disable linting temporarily
ENV NEXT_PUBLIC_ESLINT_DISABLE=true
# Build the Next.js app
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]