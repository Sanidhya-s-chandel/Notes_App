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

app.get("/Update", (req, res) => {
    const fileName = req.query.fileName;

    fs.readFile(`./public/${fileName}`, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send("File not found or error reading file");
            return;
        }

        const lines = data.split('\n');
        const noteDescription = lines[0]; 
        const Data = lines.slice(1).join('\n');

        res.render("update", { fileName, noteDescription, Data });
    });
});

app.post('/Update', (req, res) => {
    const { fileName, noteDescription, Data } = req.body;
    const updatedContent = `${noteDescription}\n\n${Data}`;

    fs.writeFile(`./public/${fileName}`, updatedContent, (err) => { 
        if (err) {
            res.status(500).send("Error updating file");
        } else {
            res.redirect('/'); 
        }
    });
});

app.get("/delete",(req,res)=>{
    fs.unlink(`./public/${req.query.fileName}`,(err)=>{
        if(err) throw err
        else res.redirect("/")
    })
})

app.listen(3000);