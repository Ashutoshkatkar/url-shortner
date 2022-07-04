const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require("body-parser");
var shortUrl = require("node-url-shortener");
var validUrl = require('valid-url');
const User = require('./Mschema')
const cors = require("cors");
require('dotenv').config();
const app = express()
const port = 8080

const DB = process.env.DB

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Db connected")
}).catch((err) => { console.log("error is", err) })

// app.use('/', (req, res) => {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.send(data)
// })
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/insert', (req, res) => {

    console.log("data is", req.body)

    const email = req.body.email
    const longurl = req.body.longurl
    const code = req.body.code
    // User.find({ name: email }, (err, docs) => {
    //     if (docs.length) {
    // const user = new User()
    // console.log("updation")


    // res.send({ status: 500, msg: "Email already exist" });
    // }
    // else {  

    if (validUrl.isUri(longurl)) {
        User.find({ $or: [{ longurl: longurl }, { code: code }] }, (err, data) => {
            if (data.length) {
                res.send({ status: 500, msg: "Url and code should not be repeated" });
                console.log("already exist");
            } else {
                shortUrl.short(longurl, (err, url) => {
                    const user = new User({ name: email, longurl: longurl, code: code, shorturl: url })
                    user.save().then(() => {
                        res.send({ status: 200, msg: "Inserted sucessfully" });
                    }).catch((err) => { console.log(err) })
                })

            }
        })
    } else {
        res.send({ status: 500, msg: "Invalid url" });
    }



    //}
    //})

})

app.use('/insert2', (req, res) => {
    console.log("data is", req.body)
    email = req.body.email;
    User.find({ name: email }, (err, docs) => {
        if (docs.length) {
            res.send({ status: 200, data: docs, msg: "find" })
            console.log("gooddddddddddd")
        } else {
            res.send({ status: 500, data: docs, msg: "not found" });
        }
    })
})

app.get('/hello', function (req, res) {
    res.json({ message: 'hello from server' });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})