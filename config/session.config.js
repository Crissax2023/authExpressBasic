//requier Session
const session = require("express-session");
//Agregar  connect-mongo
const MongoStore = require("connect-mongo");
//agregar mongoose
const mongoose = require("mongoose");
module.exports = (app)=>{
    app.use(
        session({
            secret:process.env.SECRET,
            resave:true,
            saveUninitialized:false,
            cookie:{
                httpOnly:true,
                maxAge:60000 //60 * 1000ms ==== 1min
            },
            store: MongoStore.create({
                mongoUrl:process.env.MONGODB_URI || "mongodb://localhost/authexpressbasic",
                //ttl => time to live
                //ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1day
            })
        })
    )
}