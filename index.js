const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
//import fungsi authorization auth
const auth = require("./auth")

//import route user
const user = require("./route/user")
app.use("/", user)

//import route user Admin
const user_admin = require("./route/user_admin")
app.use("/", user_admin)

//import route pengaduan
const pengaduan = require("./route/pengaduan")
app.use("/pengaduan",  pengaduan)

//import route tanggapan
const tanggapan = require("./route/tanggapan")
app.use("/tanggapan",  tanggapan)

app.use(express.static(__dirname))

app.listen(2000, () => {

    console.log("Server run on port 2000");
})
