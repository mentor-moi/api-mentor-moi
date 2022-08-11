const Mentor = require("../models/Mentor");

exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Remplissez les champs pour une modification"
      });
    }
  
    const id = req.params.id;
  
    Mentor.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Ce Mentor n'existe pas`
          });
        } else res.send({ message: "Profil mis à jour" });
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur" + id
        });
      });
  };