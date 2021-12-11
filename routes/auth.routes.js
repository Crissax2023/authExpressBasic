const router = require("express").Router();
const User = require("../models/User.model")
const bcryptjs = require("bcryptjs"); //<==== muy muy importante
const mongoose  = require("mongoose");
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});

router.post("/signup", async(req, res, next) => {
    //destructuring
    const {email, username, password, ...rest} = req.body
    try{
        //1)
        const salt = bcryptjs.genSaltSync(10)
        const newPassword = bcryptjs.hashSync(password,salt)
        //OJASOIJDSOIFJA789832HR27YR47.37RY34789RTU
        const user = await User.create({email, username, password: newPassword })

        res.redirect(`/auth/login`)

    }catch(error){
        console.log("error:",error.message)

        if(error instanceof mongoose.Error.ValidationError){
            res.status(500).render('auth/signup',{ errorMessage:error.message } )
        }else if(error.code === 11000){
            res.status(500).render('auth/signup',{ errorMessage:"Email y username son unicos, alguno de ellos ya fue utilizado"})
        }else{
            next(error)
        }
    }

})

router.get("/login",(req,res,next)=>{
 
    res.render("auth/login")
})

// luego la usaremos
router.get("/profile/:id", (req, res, next) => {

    User.findById(req.params.id)
    .then(user=>{
        console.log("user1",user)
        //return user without pass
        const userPass =  user.toObject()
        delete userPass.password
        //delete userPass["password"]
        //1) const {password,...restUser} = userPass

        console.log("user2",userPass)

        res.render("profile",{user:userPass})
    })
    .catch(error=>{
        console.log("error:",error)
        res.send("El error!!!")
    })
})


module.exports = router;
