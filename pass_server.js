var http = require('http');  

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const PassFactory = require("./core/pass_factory");
const DataIntegrity = require("./core/data_integrity");


//WEBSOCKETS START
var server = require('websocket').server, http = require('http');
var userMap=new Map();
var socket = new server({  
    httpServer: http.createServer().listen(1337)
});
var count=1;
socket.on('request', function(request) {  

    var connection = request.accept(null, request.origin);
console.log("made connection->" + connection.constructor.name);
console.log("connection.closeDescription->" + connection.closeDescription);
console.log("connection.closeReasonCode->" + connection.closeReasonCode);
console.log("connection.protocol->" + connection.protocol);
console.log("connection.extensions->" + connection.extensions);
console.log("connection.remoteAddress->" + connection.remoteAddress);
console.log("connection.webSocketVersion->" + connection.webSocketVersion);
console.log("connection.connected->" + connection.connected);

    connection.on('message',async  function(message) {
		console.log("got message->" + message.utf8Data + " from->" + connection.myuser);
		var userData=JSON.parse(message.utf8Data);
		if ( userData.func == "signin") {
			connection.myuser=userData.userName;
			userMap.set(userData.userName,connection);
			console.log("siginging in->" + userData.userName);
			connection.send(JSON.stringify( { func: 'signinsuccess' , message: 'hello ' + userData.userName + ", we will set you up for location " + userData.location }));

			console.log("sent");
		} else if ( userData.func == "sendMessage" ) {
			var toUser = userMap.get(userData.toUser);
			if ( toUser == null ) {
				connection.send("can't find->" + userData.toUser ) ;
			} else {
				toUser.send(JSON.stringify(userData));
				connection.send( JSON.stringify({func:"successSendMessage", message: "message was sent to->" + userData.toUser}));
			}
		} else { 
			connection.send("Sorry, I don't understand what you are asking for.");
		}	
    });

    connection.on('close', function(connection) {
        console.log('connection closed->' + JSON.stringify(connection));
    });
});
// END OF WEBSOCKETS CODE

console.log("starting server...");

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

app.get('/', (req, res)=>{   
	// The render method takes the name of the HTML 
	// page to be rendered as input 
	// This page should be in the views folder 
	// in the root directory. 
	res.render('home'); 
	
});

console.log("setting up get_faculty_for");

app.get('/get_faculty_for', (req, res)=>{   
	var fid = req.query.facultyId;
	var fem = req.query.facultyEmail;
	var res;
	if ( fid != null ) {
		res = thePassFactory.theFacultyHandler.theFaculty.get(parseInt(fid));
	} else {
		res = thePassFactory.theFacultyHandler.theFacultyByEmail.get(fem);
	}
	if ( res==null ) { res="not found"; }
	res.status(200).send("Here->" + JSON.stringify(res)); 	
});
console.log("get_master_schedule_for");

app.get('/get_master_schedule_for', (req, res)=>{   
	var pd = req.query.courseView;
	res.status(200).send("Here->" + JSON.stringify(thePassFactory.theMasterScheduleHandler.theMasterSchedule.get(pd))); 
	
});
console.log("get_student_for");
app.get('/get_student_for', (req, res)=>{   
	var pd = req.query.studentId;
	console.log("getting student for->"+ pd);
	res.status(200).send("Here->" + JSON.stringify(thePassFactory.theStudentHandler.theStudents.get(parseInt(pd)))); 
}); 
/*
 * This provides a direct link to user dev card.
 */
console.log("mail_test...");
app.get("/mail_test", (req, res)=>{   
	var name = req.query.name;
	var title= req.query.title;
	var data={};
	data.name = name;
	data.title = title;
	res.status(200).send(JSON.stringify(data)); 
	
});

console.log("mail_passes");
app.get("/mail_pases", (req, res)=>{   
	
	res.status(200).send(JSON.stringify(data)); 
	
});

console.log("initialize_data");
app.post("/initialize_data", (req, res)=>{   
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		console.log("in initialize_data call->" + JSON.stringify(data));
		await thePassFactory.initialize( data.forDate);
		res.status(200).send(JSON.stringify(DataIntegrity.issues)); 	
	} )();
});
console.log("get_student_data");
app.post("/get_student_data", (req, res)=>{   
	console.log("in get_student_data call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		res.status(200).send(JSON.stringify(Array.from(thePassFactory.theStudentHandler.theStudents.values()))); 	
	} )();
});
console.log("get_student_block_names");

app.post("/get_student_block_names", (req, res)=>{   
	console.log("in get_student_block_names call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr= Array.from(thePassFactory.theMasterScheduleHandler.allStudentBlockNames.entries()); 	
		res.status(200).send(JSON.stringify(rr)); 	
	} )();
});
console.log("get_passes");
app.post("/get_passes", (req, res)=>{   
	console.log("in get_passes call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr= Array.from(thePassFactory.thePassHandler.thePasses.values()); 	
		res.status(200).send(JSON.stringify(rr)); 	
	} )();
});
console.log("get_decorate_passes");
app.post("/get_decorated_passes", (req, res)=>{   
	console.log("in get_decorated_passes call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr=await thePassFactory.getDecoratedPasses(); 	
		res.status(200).send(JSON.stringify(rr)); 	
	} )();
});
app.get("/send_test_email", (req, res)=>{   
	console.log("in send_test_email");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr=await thePassFactory.theEmailHandler.sendTestEmail(); 	
		res.status(200).send("Sent test email"); 	
	} )();
});
/*
 * Start the passFactory
 */
 console.log("starting PassFactory...");
var thePassFactory = new PassFactory();

/*
 * Startup the server!
 */
var http_port = 8002; 

http.createServer(app).listen(http_port);


