FROM node:alpine
WORKDIR /usr/app
COPY ./package.json ./
RUN npm install
COPY . .

# npm run dev - is using nodemon from package.json
# and it automatically reloads the content if changed in source 
CMD ["npm", "run", "start"]