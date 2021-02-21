const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
       if (err) throw err;
       const notes = JSON.parse(data);
       res.json(notes);
    })
    
})

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const note = {
            title: req.body.title,
            text: req.body.text  
        }
        note.id = uniqid();
        notes.push(note)
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
            console.log("Success!")
            res.sendFile(path.join(__dirname + '/public/index.html'))
        })
        
     })
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id != req.params.id)
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
            console.log('Success!')
            res.sendFile(path.join(__dirname + '/public/index.html'))
        })
        
     })
})

app.get('*', (req, res) =>  {
    res.sendFile(path.join(__dirname + '/public/index.html'));
})




app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
  });