const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const db = require("../config")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const moment = require("moment")

app.use(express.static(__dirname));
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "image-"+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})


app.get("/", (req, res) => {
    let sql = "select * from pengaduan"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }else{
            let response = {
                count: result.length,
                pengaduan: result
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})

app.post("/save", upload.single("image"), (req,res) => {
    let data = {
        id_pengaduan: req.body.id_pengaduan,
        tgl_pengaduan : moment().format('YYYY-MM-DD HH:mm:ss'),
        id_siswa: req.body.id_siswa,
        isi_pengaduan: req.body.isi_pengaduan,
        lokasi_pengaduan: req.body.lokasi_pengaduan,
        image: req.file.filename,
        status: req.body.status
    }

    let message = ""

    if(!req.file) {
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    }else{
        let sql = "insert into pengaduan set ?"
        db.query(sql, data, (err,result) => {
            if (err) {
                message = err.message
            } else {
                message = result.affectedRows + " row inserted"
            }
    
            let response = {
                message : message
            }
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        })
    }
})

module.exports = app