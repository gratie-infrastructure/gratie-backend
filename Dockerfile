# FROM node:16

# WORKDIR /src
# COPY package*.json /
# EXPOSE 5000

# ENV NODE_ENV=development
# ENV PORT 5000
# RUN npm install -g nodemon && npm install
# COPY . /
# CMD ["nodemon", "bin/www"]

# Specify a base image
FROM node:alpine

#Install some dependencies

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

# Set up a default command
CMD [ "npm","run", "dev" ]
