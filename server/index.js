const express = require("express");
const bodyParser = require("body-parser");
const pinataHelper = require('./pinataHelper');
const path = require('path');

var logger = require('morgan');


const PORT = process.env.PORT || 3001;
const app = express();
const cors = require('cors');
app.use(cors())
app.use(logger('dev'));

app.use(express.static(path.resolve(__dirname, '../react-frontend/build')));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-frontend/build', 'index.html'));
});


// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/handle', jsonParser, async (request,response) => {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
    let txn = await pinataHelper(request.body.data)
    //console.log(txn)
    const urlResponse = {
      "pinata" : txn
    }
    
    response.send(JSON.stringify(urlResponse))
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

