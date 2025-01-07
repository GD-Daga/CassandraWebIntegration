# Base img
FROM node:22-alpine

#Working Dir in container
WORKDIR /app

#Copy files to container
COPY package*.json .

#Install dependencies
RUN npm install

#Copy remianing files
COPY . .

#Run webapp
CMD ["npm", "run", "dev"]