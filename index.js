const {response} = require("express");
const express = require("express");

const app = express();

app.get('/data', (request, response) => {
    response.send("fly me to the moon");
});

app.get('/data/add/:name', (request, response) => {
    const {name} = request.params;
    response.send(`Thank you for the contribution, the data we received is: ${name}`)
})

app.listen(3000, ()=> {console.log("connected to port 3000");});