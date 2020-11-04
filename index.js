var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
const { json } = require("body-parser");

//start mysql connection
var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : 'lannet@123', //mysql database password
  database : 'aqfitapp' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

//create app server
var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});



//rest api to get all customers
app.get('/customer', function (req, res) {
   connection.query('select * from customer', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
//rest api to get a single customer data
app.get('/customer/:id', function (req, res) {
   connection.query('select * from customers where Id=?', [req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

// Login 

app.post("/customer/login", function(req, res){
 var user=req.body;

 connection.query('select * from signup where MOBILE=?',[user.mobile],function (error, results,fields){

  if(error)
  {
    res.end(JSON.stringify({success:0,message:"You enter invalid mobile number!"}))
  }else{
    //res.end(JSON.stringify(results[4]))


    
    if(results[0].PASSWORD==user.pas && results[0].MOBILE==user.mobile)
    {
      res.end(JSON.stringify({success:1,message:"Login successful",data:results})) 
    }else{
      res.end(JSON.stringify({success:0,message:"You entered Wrong mobile no & password!!"}))
    }
  }

 });
});

//rest api to create New User Account
app.post('/customer/signup', function (req, res) {
   var params  = req.body;
   
   console.log(params);
   connection.query('INSERT INTO signup SET ?', params, function (error, results, fields) {
    if (error) 
    {
      res.end(JSON.stringify({success:0,message:"error"}));
    }else{

      connection.query('select * from signup where U_ID=?', [results.insertId], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify({status:1,message:"success",data:results}));
      });
      //res.end(JSON.stringify({success:1,id:results.insertId,message:"success",data:results}));
    }
	  
	});
});


//rest api to create a HeartRate
app.post('/customer/home/heatrate', function (req, res) {
  var params  = req.body;
  
  console.log(params);
  connection.query('INSERT INTO home SET ?', params, function (error, results, fields) {
   if (error) 
   {
     res.end(JSON.stringify({success:0,message:"error"}));
   }else{
     res.end(JSON.stringify({success:1,message:"success"}));
   }
   
 });
});



//rest api to create a Workout 
app.post('/customer/home/Workout', function (req, res) {
  var params  = req.body;
  
  console.log(params);
  connection.query('INSERT INTO home SET ?', params, function (error, results, fields) {
   if (error) 
   {
     res.end(JSON.stringify({success:0,message:"error"}));
   }else{
     res.end(JSON.stringify({success:1,message:"success"}));
   }
   
 });
});





//rest api to update record into mysql database
app.put('/customer', function (req, res) {
   connection.query('UPDATE `customer` SET `Name`=?,`Address`=?,`Country`=?,`Phone`=? where `Id`=?', [req.body.Name,req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//rest api to delete record from mysql database
app.delete('/customer', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `customer` WHERE `Id`=?', [req.body.Id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});