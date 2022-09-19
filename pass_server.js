var http = require('http');  

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const PassFactory = require("./core/pass_factory");
const DataIntegrity = require("./core/data_integrity");

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
app.get('/get_master_schedule_for', (req, res)=>{   
	var pd = req.query.courseView;
	res.status(200).send("Here->" + JSON.stringify(thePassFactory.theMasterScheduleHandler.theMasterSchedule.get(pd))); 
	
});
app.get('/get_student_for', (req, res)=>{   
	var pd = req.query.studentId;
	console.log("getting student for->"+ pd);
	res.status(200).send("Here->" + JSON.stringify(thePassFactory.theStudentHandler.theStudents.get(parseInt(pd)))); 
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

app.get("/mail_pases", (req, res)=>{   
	
	res.status(200).send(JSON.stringify(data)); 
	
});

app.post("/initialize_data", (req, res)=>{   
	console.log("in initialize_data call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		await thePassFactory.initialize();
		res.status(200).send(JSON.stringify(DataIntegrity.issues)); 	
	} )();
});
app.post("/get_student_data", (req, res)=>{   
	console.log("in get_student_data call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		res.status(200).send(JSON.stringify(Array.from(thePassFactory.theStudentHandler.theStudents.values()))); 	
	} )();
});
app.post("/get_student_block_names", (req, res)=>{   
	console.log("in get_student_block_names call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr= Array.from(thePassFactory.theMasterScheduleHandler.allStudentBlockNames.entries()); 	
		res.status(200).send(JSON.stringify(rr)); 	
	} )();
});
app.post("/get_passes", (req, res)=>{   
	console.log("in get_passes call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr= Array.from(thePassFactory.thePassHandler.thePasses.values()); 	
		res.status(200).send(JSON.stringify(rr)); 	
	} )();
});
app.post("/get_decorated_passes", (req, res)=>{   
	console.log("in get_decorated_passes call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr=await thePassFactory.getDecoratedPasses(); 	
		res.status(200).send(JSON.stringify(rr)); 	
	} )();
});
/*
 * Start the passFactory
 */
var thePassFactory = new PassFactory();

/*
 * Startup the server!
 */
var http_port = 8002; 

http.createServer(app).listen(http_port);


