# Base img
FROM node:22-alpine

#Working Dir in container
WORKDIR /app

#Copy files to container
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy remianing files
COPY . .

#Expose port for app
EXPOSE 3000

#Run webapp
CMD ["npm", "start"]