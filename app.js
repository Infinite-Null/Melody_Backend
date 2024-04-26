const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const dotenv=require('dotenv')
const cors = require('cors');

dotenv.config()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
    origin: '*'
}));

//import routes
const userRoute = require("./Routes/user")
//using route in app
app.use("/api/v1", userRoute)


module.exports = app
