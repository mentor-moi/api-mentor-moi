const router = require("express").Router()
const User = require("../models/User")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
} = require("../routes/validation")
const nodemailer = require("nodemailer")
const dotenv = require("dotenv")

const sendEmail = require("../utils/sentEmail")
const ErrorResponse = require("../utils/errorResponse")

dotenv.config()

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: "mentor.moi.22@gmail.com",
    pass: process.env.GMAIL,
  },
  secure: true,
})

router.post("/register", async (req, res) => {
  // Validate Data before we create user
  const { error } = registerValidation(req.body)

  if (error) return res.status(400).send(error.details[0].message)

  //Check if User is already in db
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) return res.status(400).send("L'email est déjà utilisé")

  // Hash passwords
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // Create New User
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
  })
  try {
    const savedUser = await user.save()
    res.status(201).send({ user })

    await sendEmail({
      from: "mentor.moi2021@gmail.com", // sender address
      to: req.body.email, // list of receivers
      subject: "Inscription sur le site Mentor-moi 🎓 🚀 ",
      text: "Mentor moi",
      html: "<p><b>Bonjour</b> 👋, <br> Ceci est un mail pour confirmer votre inscription sur le site Mentor-moi. <br> Bonne session de mentorat 💻 <br> Cordialment <br> Mentor moi </p>",
    })

    res.status(200).json({ success: true, data: "Email envoyé" })
  } catch (err) {
    res.status(400).send(err)
  }
})

//LOGIN
router.post("/login", async (req, res) => {
  // Validate Data before we create user
  const { error } = loginValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //Check if email exist
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Cet email n'existe pas !")

  //Check Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword)
    return res.status(400).send("Le mot de passe est incorrect !")

  //Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  })
  res.header("auth-token", token).send({ user, token })
})

//Forgot password
router.post("/forgotpassword", async (req, res, next) => {
  // Validate Data before we create user
  const { error } = forgotPasswordValidation(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    const user = await User.findOne({ email: req.body.email })

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken()

    await user.save()

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`
    // const resetUrl = `https://mentor-moi.netlify.app/fr/passwordreset/${resetToken}`

    const message = `
      
  
  
  
  
  <!doctype html>
  <html lang="fr-FR">
  
  <head>
      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
      <title>Reset Password Email Template</title>
      <meta name="description" content="Reset Password Email Template.">
      <style type="text/css">
          a:hover {text-decoration: underline !important;}
      </style>
  </head>
  
  <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
      <!--100% body table-->
      <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
          style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
              <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                      align="center" cellpadding="0" cellspacing="0">
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                            <a href="https://rakeshmandal.com" title="logo" target="_blank">
                              <img width="60" src="https://i.ibb.co/C05gV1p/logo-c0f66290.png" title="logo" alt="logo">
                            </a>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td>
                              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Vous avez demandé à réinitialiser votre mot de passe</h1>
                                          <span
                                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                          Il semble que vous ayez oublié le mot de passe de votre compte du site Web. <br>
  
                                          Vous pouvez changer votre mot de passe en cliquant sur le bouton ci-dessous :
                                          </p>
                                          <a href=${resetUrl} 
  
                                              style="background:#DDCB9C;text-decoration:none !important; font-weight:500; margin-top:35px; color:#000;text-transform:uppercase; font-size:14px;padding: 1.5rem 3rem;;display:inline-block;border-radius:50px;" clicktracking=off>Reset
                                              Password</a>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                              </table>
                          </td>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://mentor-moi.netlify.app/fr</strong></p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
      <!--/100% body table-->
  </body>
  
  </html>
      `

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      })

      res.status(200).json({ success: true, data: "Email envoyé" })
    } catch (err) {
      console.log(err)

      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      return next(new ErrorResponse("Email could not be sent", 500))
    }
  } catch (error) {
    next(error)
  }
})

//Reset password
router.put("/resetpassword/:resetToken", async (req, res, next) => {
  // Compare token in URL params to hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex")

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).send("Token invalide")
    }

    user.date = Date.now()

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(201).json({
      success: true,
      data: "Mot de passe modifié",
      token: user.getSignedJwtToken(),
    })
  } catch (error) {
    return res.status(400).send(error)
  }
})

module.exports = router
