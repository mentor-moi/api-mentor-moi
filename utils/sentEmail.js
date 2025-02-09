const nodemailer = require("nodemailer")
var sgTransport = require("nodemailer-sendgrid-transport")

const sendEmail = (options) => {
  // const transporter = nodemailer.createTransport({
  //   service: process.env.EMAIL_SERVICE,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //
  //   },
  // })

  var opt = {
    auth: {
      api_key: process.env.EMAIL_PASSWORD,
    },
  }

  const transporter = nodemailer.createTransport(sgTransport(opt))

  const mailOptions = {
    from: "mentormoi@outlook.com",
    to: options.to,
    subject: options.subject,
    html: options.text,
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (error) {
      console.log(error)
    } else {
      console.log(info)
    }
  })
}

module.exports = sendEmail
