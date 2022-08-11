const express = require("express")
const app = express()
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")
const mentors = require("./routes/mentors")

dotenv.config()

mongoose.connect(
  process.env.DB_CONNECT_DEV,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: true,
  },
  () => console.log("DB connected ")
)

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
app.use("/uploads", express.static("uploads"))
app.use(cors())

// Route middlewware
app.use("/api/user", authRoute)
app.use("/api/posts", postRoute)
app.use("/api", mentors)

module.exports = app
