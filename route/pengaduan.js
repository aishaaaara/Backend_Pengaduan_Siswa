const express = require("express")
const app = express()

const db = require("../config")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
//inisialisasi library moment untuk menyimpan format date-time
const moment = require("moment")


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,"./image")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
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
    if(!req.file) {
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    }else{
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


// POST: /pengaduan/update --> end point untuk update data pengaduan
app.post("/update", (req,res) => {
    let data = [{
        id_pengaduan: req.body.id_pengaduan,
        tgl_pengaduan:  moment().format('YYYY-MM-DD HH:mm:ss'),
        id_siswa: req.body.id_siswa,
        isi_pengaduan: req.body.isi_pengaduan,
        lokasi_pengaduan: req.body.lokasi_pengaduan,
        image: req.file.filename,
        status: req.body.status,
        
    }, req.body.id_pengaduan]
    let message = ""

    let sql = "update pengaduan set ? where id_pengaduan = ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row updated"
        }

        let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})

// DELETE: /pengaduan/:id_pengaduan --> end point untuk hapus data pengaduan
app.delete("/:id_pengaduan", (req,res) => {
    let data = {
        id_pengaduan : req.params.id_pengaduan
    }
    let message = ""
    let sql = "delete from pengaduan where ?"
    db.query(sql, data, (err,result) => {
        if (err) {
            message = err.message
        } else {
            message = result.affectedRows + " row deleted"
        }


let response = {
            message : message
        }
        res.setHeader("Content-Type","application/json")
        res.send(JSON.stringify(response))
    })
})
module.exports = app