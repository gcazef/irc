const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'

//REGISTER

users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
        nickname : req.body.nickname,
        login: req.body.login,
        password: req.body.password
    }
    
    User.findOne({
        where: {
          login: req.body.login
        }
    })
    
    .then(user => {
        if(!user){
            const hash = bcrypt.hashSync(userData.password, 10)
            userData.password = hash
            User.create(userData)
                .then(user => {
                    console.log(req.body.password);
                    console.log(user.password);
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.json({ token: token })
                })
                .catch(err => {
                    res.send('error: ' + error)
                })
        } else {
            res.json({ error: 'User already exists' })
        }
    })
})

//LOGIN

users.post('/login', (req, res) => {
    User.findOne({
        where: {
            login: req.body.login
        }
    })
    .then(user => {
        console.log("Ici");
        console.log(user.password);
        console.log(req.body.password);
        var passwordIsValid = bcrypt.compareSync(user.password, req.body.password);
        if(!passwordIsValid) {
//        if(bcrypt.compareSync(user.password, req.body.password)) {
            console.log("Là");
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.json({token: token})
        } else {
            res.send('error: ' + error)
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
})

module.exports = users