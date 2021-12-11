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


router.post("/login",async (req,res,next)=>{
    //async await try{}catch(erro){}
    try{
        const {username, password,...rest}=req.body
        // validamos que el user nos mande datos!!!! 
        if(username === '' || password === ''){
            res.render("auth/login",{errorMessage:"Hey bro!!! llena los campos (username, password)"})
            return;
        }

        const user = await User.findOne({username})

        console.log("user",user)
        // VALIDAMOS SI EXISTE EL USERNAME EN NUESTA BASE DE DATOS (BD || DB)
        if(!user){
            res.render("auth/login",{errorMessage:"La contraseña o el username son invalidos"})
            return;
        }  
                                //bcryptjs.compareSync("perro","45678ashdas87d6tg3876d.978asd")
        if(bcryptjs.compareSync(password,user.password)){ //recordar que bcryptjs.compareSync solo nos regresa un true || false 
            const userSP = user.toObject()
            delete userSP['password']
            res.render('private/profile',{user:userSP})
        }else{
            res.render("auth/login",{errorMessage:"La contraseña o el username son invalidos"})
            return;
        }

    }catch(error){
        next(error)
    }
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
