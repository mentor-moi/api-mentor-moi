 const Mentor = require("../models/Mentor");

exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Mentor.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Tutorial with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Tutorial with id=" + id });
      });
  }; 