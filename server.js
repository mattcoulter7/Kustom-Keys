require("dotenv").config();
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const designRouter = require('./routes/design')
const uploadRouter = require('./routes/upload')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const Grid = require("gridfs-stream");
const app = express()

let gfs;
const FILE_SIZE_LIMIT = '16mb'

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const conn = mongoose.connection;
conn.once("open", function () {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("photos");
});

app.set('view engine', 'ejs')

app.use(bodyParser.json({limit: FILE_SIZE_LIMIT}));
//app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({limit: FILE_SIZE_LIMIT, extended: true}));
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.get('/', async (req, res) => {
    res.render('index')
})

app.get("/file/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

app.delete("/file/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});

app.use('/designs', designRouter)
app.use("/file", uploadRouter);

app.listen(8888)