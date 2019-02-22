const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/User");

users.use(cors());

process.env.SECRET_KEY = "secret";

//REGISTER

users.post("/register", (req, res) => {
    const userData = {
        name: req.body.name,
        pwdhash: req.body.pwdhash
    };
    User.findOne({
        where: {
            name: req.body.name
        }
    })
        .then(user => {
            if(!user){
                const hash = bcrypt.hashSync(userData.pwdhash, 10);

                userData.pwdhash = hash;
                User.create(userData)
                    .then(user => {
                        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        res.json({ token: token });
                    })
                    .catch(err => {
                        res.send("error: " + err);
                    });
            } else {
                res.json({ error: "User already exists" });
            }
        });
});

//LOGIN

users.post("/login", (req, res) => {
    User.findOne({
        where: {
            name: req.body.name
        }
    })
        .then(user => {
            var passwordIsValid = bcrypt.compareSync(user.pwdhash, req.body.pwdhash);
            console.log("fdp");
            if(!passwordIsValid) {
                let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                });
                res.json({token: token});
            } else {
                res.send("Invalid password");
            }
        })
        .catch(err => {
            res.send("error: user does not exist");
        });
});

module.exports = users;