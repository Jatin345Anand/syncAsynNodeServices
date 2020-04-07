const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

//Connect to Database
mongoose.connect(config.database, { useMongoClient: true,useUnifiedTopology: true, useNewUrlParser: true });

//On Connection
mongoose.connection.on('connected', () => {
  console.log('connected to database' + config.database)
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
});
const dbConnection = mongoose.connection;
const app = express();
// const users = require('./routes/users');

//Port number
const port = 3001;

//CORS Middleware
app.use(cors());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());
// app.use('/users', users);
//swagger documentation
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "NodeRootApp",
      description: "Root Sercice",
      contact: {
        name: "Regask"
      },
    }
  },
  // ['.routes/*.js']
  apis: ["routes/api/Swagger/Swagger.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Sessions
app.use(
    session({
        secret: "regask-software", //pick a random string to make the hash that is generated secure
        store: new MongoStore({ mongooseConnection: dbConnection }),
        resave: false, //required
        saveUninitialized: false //required
    })
);

// Routes
app.use('/', require("./routes/index"))
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
 
//Index route
 app.get('/', (req,res) => {
  res.send('Invalid endpoint');
});

// .env configuration
require('dotenv').config();
console.log('production',process.env.NODE_ENV == 'production'); //false
console.log('development ',process.env.NODE_ENV == 'production ');
console.log('developement',process.env.NODE_ENV.trim() == 'development');
console.log('in alert/publish app.js',process.env.DMS_SERVICE);

//Start Server
app.listen(port, () => {
  console.log('Server started at port ' + port);
});
