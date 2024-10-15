const express = require('express');
const app = express();
const fs = require("fs")

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    fs.readdir("./public", { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        const fileDescriptions = files.map(file => {
            if (file.isFile()) {
                const fileName = file.name;
                const description = fs.readFileSync(`./public/${fileName}`, 'utf8').split('\n')[0];
                return { name: fileName, description: description };
            }
            return { name: file.name, description: '' };
        });
        res.render('index', { files: fileDescriptions });
    });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post("/submit",(req,res)=>{
    fs.writeFile(`./public/${req.body.fileName}.txt`,`${req.body.noteDescription}\n\n${req.body.Data}`,(err)=>{
        if(err) throw err
        else res.render("complete")
    })
})

app.get("/delete",(req,res)=>{
    fs.unlink(`./public/${req.query.fileName}`,(err)=>{
        if(err) throw err
        else res.render("del")
    })
})

app.listen(3000);