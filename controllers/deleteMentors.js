const Mentor = require("../models/Mentor");

exports.delete = (req, res) => {
    const id = req.params.id;
  
    Mentor.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Ce Mentor n'existe pas`
          });
        } else {
          res.status(204).send({
            message: "Mentor supprimé!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Erreur" + id
        });
      });
  };