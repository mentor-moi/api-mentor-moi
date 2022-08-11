const router = require("express").Router()
const dotenv = require("dotenv")
const updateMentors = require("../controllers/updateMentors")
const deleteMentors = require("../controllers/deleteMentors")
const getOneMentors = require("../controllers/getOneMentors")

const Mentor = require("../models/Mentor")

const multer = require("multer")
dotenv.config()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true)
  } else {
    cb(new Error("Mauvais format"), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
})
const cloudinary = require("cloudinary").v2
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

router.post("/mentors", upload.single("avatar"), async (req, res) => {
  const result = await cloudinary.uploader.upload(req.file.path)
  const mentor = new Mentor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    avatar: result.secure_url,
    title: req.body.title,
    disponible: req.body.disponible,
    presentation: req.body.presentation,
    city: req.body.city,
    technos: req.body.technos,
    socials: req.body.socials,
    userId: req.body.userId,
    cloudinary_id: result.public_id,
  })
  try {
    const savedMentor = await mentor.save()
    // SEND FILE TO CLOUDINARY s

    res.status(201).send({ mentor: mentor._id })
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get("/mentors", async (req, res) => {
  try {
    const fetchMentor = await Mentor.find({})
    res.status(200).send(fetchMentor)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.get("/mentor/:id", getOneMentors.findOne)

router.patch("/mentors/:id", upload.single("avatar"), async (req, res) => {
  try {
    const id = req.params.id
    let mentor = await Mentor.findById(id)
    await cloudinary.uploader.destroy(mentor.cloudinary_id)
    const result = await cloudinary.uploader.upload(req.file.path)

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatar: result.secure_url,
      email: req.body.email,
      city: req.body.city,
      disponible: req.body.disponible,
      presentation: req.body.presentation,
      technos: req.body.technos,
      price: req.body.price,
      socials: req.body.socials,
      userId: req.body.userId,
    }
    user = await Mentor.findByIdAndUpdate(id, data, {
      useFindAndModify: false,
    })
    // SEND FILE TO CLOUDINARY

    res.status(200).json(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.delete("/mentors/:id", deleteMentors.delete, async (req, res) => {
  try {
    const id = req.params.id

    user = await Mentor.deleteOne(id)

    res.status(200).json(user)
  } catch (err) {
    res.status(400).send(err)
  }
})

router.post("/request/mentor/:id", async (req, res) => {
  const id = req.params.id

  const mentor = await Mentor.findOneAndUpdate(
    { _id: id },
    {
      $push: {
        messageRequest: {
          email: req.body.email,
          object: req.body.object,
          message: req.body.message,
          date: req.body.date,
        },
      },
    },
    { new: true, useFindAndModify: false }
  )

  res.status(201).json({
    success: true,
    data: "Message envoyé avec success",
  })
})

module.exports = router
