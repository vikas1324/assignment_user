# Assignment
  Design a user crud application with swagger. 

## Task Done
1. Create a login api with auth 
2. Create a registration api (first name, last name, email, password, mobile no, address) (Please use hash and salt for password) 
3. List api for all users with token and pagination 
4. Update user details api with token 
5. Search api on (first name, last name, email,  mobile no) single key with token and pagination 

### Software Requirement :
1. Nodejs(v12.18.4)
2. Mongodb
3. MongoCompass(if only to see Databas) 

### Packages Used:
1. Express:- Express.js is a web application framework for Node.js. It provides various features that make web application development fast and easy which otherwise takes more time using only Node.js.
2. Moongose:- Mongoose is a JavaScript framework that is commonly used in a Node.js application with a MongoDB database.
3. cors : CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
4. swagger-jsdoc : This library reads your JSDoc-annotated source code and generates an OpenAPI (Swagger) specification.
5. swagger-ui-express : This module allows you to serve auto-generated swagger-ui generated API docs from express, based on a swagger.json file. The result is living documentation for your API hosted from your API server via a route.


### Project Setup Guide :
1. Download the project assignment_user.
2. Open the project in command prompt or vscode
3. Install packages those are used in project. Run the following command
```
    npm install 
```
4. Run project on node server using following command
```
    npm start 
```
   or for swagger
   ```
      ../src>node app.js
   ```
5. Application run on the PORT 3000. The url ``` http://<your-domain>:3000/api-docs ``` open in the browser
6. When api docs is open first you should login.
7.When login is done then you got token in output this token copy and paste it into authorize then you get the permission to access other api's.   

