FROM node:12.22.9-alpine
WORKDIR /home/neil/stratman_site/mysite
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
