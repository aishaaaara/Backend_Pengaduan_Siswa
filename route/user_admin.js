const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const md5 = require("md5")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "BelajarNodeJSItuMenyenangkan"

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

//endpoint register
app.post("/registerr", (req, res) => {
    //prepare data
    let data = {
        id_admin: req.body.id_admin,
        nip: req.body.nip,
        email: req.body.email,
        username: req.body.username,
        password: md5(req.body.password),
        telp: req.body.telp
    }

    //create sql query insert
    let sql = "insert into admin set ?"

    //run query
    db.query(sql, data, (error, result) => {
        let response = null
        if(error){
            response = {
                message: error.message
            }
        }else{
            response = {
                message: result.affectedRows + " user registered"
            }
        }
        res.json(response)
    })
})


//endpoint login user (authentication)
app.post("/loginn", (req, res) => {
    //tampung username dan password
    let param = [
        req.body.username,
        md5(req.body.password)
    ]

    //create sql querry
    let sql = "select * from admin where username = ? and password = ?"

    //run query
    db.query(sql, param, (error, result) => {
        if (error) throw error
        
        // cek jumlah data hasil query
        if (result.length > 0) {
            // user tersedia
            let payload = JSON.stringify(result[0].id_admin)
            // generate token
            let token = jwt.sign(payload, SECRET_KEY) // generate token
            res.json({
                logged: true,
                data: result,
                token: token
            })
        } else {
            // user tidak tersedia
            res.json({
                message: "Invalid username/password"
            })
        }
    })
})

module.exports = app