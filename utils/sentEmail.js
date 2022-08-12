const nodemailer = require("nodemailer")
var sgTransport = require("nodemailer-sendgrid-transport")

const sendEmail = (options) => {
  // const transporter = nodemailer.createTransport({
  //   service: process.env.EMAIL_SERVICE,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  //   tls: {
  //     // do not fail on invalid certs
  //     rejectUnauthorized: false,
  //   },
  // })

  var opt = {
    auth: {
      api_key:
        "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",
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
    if (err) {
      console.log(err)
    } else {
      console.log(info)
    }
  })
}

module.exports = sendEmail
