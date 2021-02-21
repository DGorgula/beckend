const e = require("express");
const express = require("express");
const fs = require("fs");
const {v4: uuid} = require("uuid");
const app = express();
const path = './db/';

    
app.use((req, res, next) => {
    setTimeout(next, 1000);
});
app.use(express.json());

app.get('/', (request, response) => {
    const DataFilesContent = {'my-todo': []};
    const dataFolderFiles = fs.readdirSync(path);
    const filteredFiles = dataFolderFiles.filter(file => {
        return isValidId(file);
    })
    filteredFiles.forEach( file=>{
        const content = fs.readFileSync(path+file, {encoding:'utf8', flag:'r'});
        const contentObject = JSON.parse(content);
        DataFilesContent["my-todo"].push(contentObject);
        
    })
    
    const jsonedDataFilesContent = JSON.stringify(DataFilesContent);
    response.send(jsonedDataFilesContent);
});

app.get('/:id', (request, response) => {
    const {id} = request.params;

    try {
        // REQUIREMENT: invalid id provided
        if(!isValidId(id)) {
        throw ({status: 400, message: 'Bad Request - Invalid Bin Id provided'});
        }
        // REQUIREMENT: bin not found
        else if(!isInDb(id)) { 
        throw ({status: 404, message: 'Not Found - Bin not found'});
        }
        const reponseContent = fs.readFileSync(`${path}/${id}.json`, {encoding:'utf8', flag:'r'});
        response.send(reponseContent);
    }catch (error) {
        console.log(error.message, error.stack);
        if(error.status != null){
            console.log("bvjk");
        response.status(error.status).send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
        }
        else {
            console.log("qWER");
            response.status('404').send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
        }
    }
})

app.post('/', (request, response) => {
    const idValue = uuid();
    let addStatus = true;
    const content = request.body;
    try{
        // REQUIREMENT: headers = {'content-type': 'application/json'}
        if (!('content-type' in request.headers && request.headers['content-type'] === 'application/json')) {
            throw ({status: 400, message: 'Bad Request - Expected Content-Type to be application/json'});
        }
        // REQUIREMENT: body not empty
        else if (JSON.stringify(content) === JSON.stringify({})) {
            throw ({status: 400, message: 'Bad Request - Bin cannot be blank'});
        }

        const jsonedContent = JSON.stringify(content, null, 4);
        fs.writeFileSync(`${path+idValue}.json` , jsonedContent);
        response.send(addStatus);
    }
    catch (error) {
        console.log(error.message, error.stack);
        if(error.status != null){
            console.log("bvjk");
        response.status(error.status).send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
        }
    else {
        console.log("qWER");
        response.status('404').send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
    }
}
})


app.put('/:id', (request, response) => {
    try {
        const newContent = request.body;
        const {id} = request.params;
        // REQUIREMENT: headers = {'content-type': 'application/json'}
        if (!('content-type' in request.headers && request.headers['content-type'] === 'application/json')) {
            throw ({status: 400, message: 'Bad Request - Expected Content-Type to be application/json'});
        }
        // REQUIREMENT: body not empty
        else if (JSON.stringify(newContent) === JSON.stringify({})) {
            throw ({status: 400, message: 'Bad Request - Bin cannot be blank'});
        }
        // REQUIREMENT: invalid id provided
        else if(!isValidId(id)) {
            throw ({status: 400, message: 'Bad Request - Invalid Bin Id provided'});
        }
        // REQUIREMENT: bin not found
        else if(!isInDb(id)) { 
            throw ({status: 404, message: 'Not Found - Bin not found'});
        }
        console.log("lksfgn");
        const rawOldContent = fs.readFileSync(`${path+id}.json`, {encoding:'utf8', flag:'r'});
        const oldContent = JSON.parse(rawOldContent);
        const combinedContent = {...oldContent, ...newContent}
        const jsonedCombinedContent = JSON.stringify(combinedContent, null, 4);
        let updateStatus = true;
        fs.writeFileSync(`${path+id}.json`, jsonedCombinedContent);
        console.log("fsdg");
        response.send(updateStatus);
    } catch (error) {
        console.log(error.message, error.stack);
        if(error.status != null){
            console.log("bvjk");
        response.status(error.status).send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
        }
        else {
            console.log("qWER");
            response.status('404').send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
        }
    }
});

app.delete('/:id', (request, response) => {
    const {id} = request.params;
    const deleteStatus = true;
    console.log("sdhf");
    try {
    // REQUIREMENT: invalid id provided
    if(!isValidId(id)) {
        throw ({status: 400, message: 'Bad Request - Invalid Bin Id provided'});
    }
    // REQUIREMENT: bin not found
    else if(!isInDb(id)) { 
        throw ({status: 404, message: 'Not Found - Bin not found'});
    }
    fs.unlinkSync(`${path}/${id}.json`);
    response.send(deleteStatus);
} catch (error) {
    console.log(error.message, error.stack);
    if(error.status != null){
        console.log("bvjk");
    response.status(error.status).send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
    }
    else {
        console.log("qWER");
        response.status('404').send(`There was an error with the PUT, the error was: ${error.message, error.stack}`);
    }
}
});

app.listen(3000, ()=> {console.log("connected to port 3000");});




//  checks wether the given id is a valid 1
function isValidId(fileName) {
    return (/([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12})/).test(fileName);
}

//  checks existance of db with the given name (id).
function isInDb(id) {
    const binsFolder = fs.readdirSync('./db/');
    const matchBin = binsFolder.filter((file) => {
      return file === `${id}.json`;
    })
    return matchBin[0];
  }
  
    