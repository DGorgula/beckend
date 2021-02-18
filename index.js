const express = require("express");
const fs = require("fs");
const {v4: uuid} = require("uuid");
const app = express();
app.use(express.json());
const path = './';

app.get('/allData', (request, response) => {
    const DataFilesContent = {'my-todo': []};
    const dataFolderFiles = fs.readdirSync(path);
    const filteredFiles = dataFolderFiles.filter(file => {
        return isValidId(file);
    })
    filteredFiles.forEach( file=>{
        const content = fs.readFileSync(path+file);
        const contentObject = JSON.parse(content);
        DataFilesContent["my-todo"].push(contentObject);
        
    })

    const jsonedDataFilesContent = JSON.stringify(DataFilesContent);
    response.send(jsonedDataFilesContent);
});

app.get('/:id', (request, response) => {
    const {id} = request.params;
    if (!isValidId(id)) {
        updateStatus = false;
        response.send(updateStatus);
        return;
    }
    const reponseContent = fs.readFileSync(`./${id}.json`);
    response.send(reponseContent);
})

app.post('/add', (request, response) => {
    const idValue = uuid();
    let addStatus = true
    const content = request.body;
    content.id = idValue;
    const jsonedContent = JSON.stringify(content);
    
    fs.writeFile(`${path+idValue}.json` , jsonedContent, () => {});
    response.send(addingStatus);
    console.log(request.body);
})


app.put('/edit/:id', (request, response) => {
    const {id} = request.params;
    let updateStatus = true
    if (!isValidId(id)) {
        updateStatus = false;
        response.send(updateStatus);
        return;
    }
    const rawOldContent = fs.readFileSync(`${path+id}.json`);
    const oldContent = JSON.parse(rawOldContent);
    const content = request.body;
    for (let property in content) {
        oldContent[property] = content[property];
    }
    const jsonedContent = JSON.stringify(oldContent);
    fs.writeFileSync(`${path+id}.json`, jsonedContent);
    response.send(updateStatus);
});

app.delete('/delete/:id', (request, response) => {
    const {id} = request.params;
    let deleteStatus = true
    if (!isValidId(id)) {
        deleteStatus = false;
        response.send(deleteStatus);
        return;
    }
    fs.unlinkSync(`./${id}.json`);
    response.send(deleteStatus);
});


app.listen(3000, ()=> {console.log("connected to port 3000");});

function isValidId(fileName) {
   return (/([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12})/).test(fileName);
}