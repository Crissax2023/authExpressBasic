const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
// luego la usaremos
router.get("/profile", (req, res, next) => {
  //mi usuario se encuentra guardado en el req.session.currentUser

  console.log("req.",req.session)
 res.render('private/profile',{user: req.session.currentUser })
})
module.exports = router;
