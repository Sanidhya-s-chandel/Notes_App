const express = require('express');
const app = express();
const fs = require("fs")

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    fs.readdir("./public",{withFileTypes:true},(err,files)=>{
        res.render('index',{files})
    })
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.get("/submit",(req,res)=>{
    fs.writeFile(`./public/${req.query.fileName}.txt`,req.query.Data,(err)=>{
        if(err) throw err
        else res.render("complete")
    })
})

app.listen(3000);