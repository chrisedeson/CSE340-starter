/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

// LiveReload Setup
const livereload = require("livereload")
const connectLivereload = require("connect-livereload")
const path = require("path")

const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public'), path.join(__dirname, 'views'))

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/")
  }, 100)
})

app.use(connectLivereload()) // <--- injects livereload script automatically

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Index route
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})
