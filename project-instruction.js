// npm i express dotenv nodemon
// we create .env and .gitignore, and we add node_modules and .env in gitignore The purpose of gitignore files is to ensure that certain files not tracked by git remain untracked.
//  node app.js, is the first commant to start listening to the server and will be replaced later with nodemon
//We replace the below line with nodemon to be able to see changes without having to restart the server after any single change >> we change this in package.json file
// "test": "echo \"Error: no test specified\" && exit 1"
// "start": "nodemon app.js"
// The user of MongoDB will not work unless you recently change the passwrod of the user from Mongo Atlas
// when we create the 1st signup request using postman it's crucial to add "Content-Type": "application/json" as key value pair in the headers configuration in postman client
// npm i express-validator is used to validate signup 
// express-validator v6 gives this issue TypeError: expressValidator is not a function so replace in package.json "express-validator": "^5.3.1", and then run npm install then npm start
// install jwt to create signin token >> npm i express-jwt jsonwebtoken
// npm i cors is installed and required in the app.js to make sure we don't receive the cross origin errors
