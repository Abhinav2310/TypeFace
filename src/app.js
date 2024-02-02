const express = require("express");
var mysql = require('mysql');

var bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
var fileupload = require("express-fileupload");
app.use(fileupload());
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Abhinav@1",
    database: "mydb"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    // con.query("Create Table file(id Int AUTO_INCREMENT Not Null Primary Key, fileName Varchar(30), fileData LONGBLOB Not Null, fileSize Varchar(20) Not Null, fileType Varchar(20) Not Null, createdAt Datetime Not Null)", function (err, result) {
    //   if (err) throw err;
    //   console.log("table created");
    // });
  });

app.get("/files/getById/:fileId", (req, res) => {
    const { fileId }=req.params;
    const query = "Select * From file Where id = ?";
    con.query(query, [fileId], (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log(Buffer.from(result[0].file_data).toString())
      res.status(200).send({result});
    })
  });
  
  app.post("/files/upload", (req, res) => {
    const { fileName } = req.body;
    const { file } = req.files;
    const query = "Insert Into file(fileName, fileData, fileSize, fileType, createdAt) Values(?,?,?,?,CURRENT_TIMESTAMP)";
    con.query(query, [fileName, file.data, file.size, file.mimetype], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ msg:'SERVER_ERROR' });
      }
      res.status(200).send({ id:result.insertId });
    })
  });

  app.put("/files/update/:fileId", (req, res) => {
    const {fileId} = req.params;
    const { fileName } = req.body;
    const { file } = req.files;
    const query = "UPDATE file SET fileName=?, fileData = ?, fileSize = ?, fileType = ?, createdAT = CURRENT_TIMESTAMP Where id= ?"
    con.query(query, [fileName, file.data, file.size, file.mimetype, fileId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ msg:'SERVER_ERROR' });
      }
      res.status(200).send({ msg: 'Update Successful!!'});
    })
  });

  app.delete("/files/delete/:fileId", (req, res) => {
    const {fileId} = req.params;
    const query = "DELETE from file Where id = ?"
    con.query(query, [fileId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ msg:'SERVER_ERROR' });
      }
      res.status(200).send({ msg: 'DELETE Successful!!'});
    })
  });

  app.get("/files/getAll", (req, res) => {
    const query = "SELECT * from file"
    con.query(query, [], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ msg:'SERVER_ERROR' });
      }
      res.status(200).send({ result});
    })
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    };
    
    response.send(status);
 });