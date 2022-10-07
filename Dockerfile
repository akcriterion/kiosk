# FROM node:16.17.0-slim
FROM node:14.19.0-slim
WORKDIR /frontend
COPY . .
RUN npm install
CMD ["npm", "start"]
