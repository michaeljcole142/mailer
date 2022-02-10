var http = require('http');  

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const PassFactory = require("./core/pass_factory");

//Middle ware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));


app.set('view engine', 'ejs');

app.get("/hello_world", (req, res) => {
	(async() =>  { 
		res.status(200).send("Hello Jane.");
	} )();
});
/*
 * This provides a direct link to user dev card.
 */
app.get("/mail_test", (req, res)=>{   
	var name = req.query.name;
	var title= req.query.title;
	var data={};
	data.name = name;
	data.title = title;
	res.status(200).send(JSON.stringify(data)); 
	
});

/*
 * Start the passFactory
 */
var thePassFactory = new PassFactory();
thePassFactory.initialize();

/*
 * Startup the server!
 */
var http_port = 8002; 

http.createServer(app).listen(http_port);


