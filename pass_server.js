var http = require('http');  

const express = require("express");
const app = express();
const bodyparser = require("body-parser");

const PassFactory = require("./core/pass_factory");
const DataIntegrity = require("./core/data_integrity");
const RTManager = require("./core/rt_manager");
const BlockCalculator = require("./core/block_calculator");

/*
 * These are the only 2 lines of code that are needed
 * to start up the websocket server.
 */
var theRTManager = new RTManager(1337);
theRTManager.initialize();


console.log("starting server...");

//Middle ware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var publicDir = require('path').join(__dirname,'/public');
console.log("PUBLIC DIR->" + publicDir);
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
app.get('/home2', (req, res)=>{   
	// The render method takes the name of the HTML 
	// page to be rendered as input 
	// This page should be in the views folder 
	// in the root directory. 
	res.render('home2'); 
	
});

console.log("setting up get_faculty_for");

app.get('/get_faculty_for', (req, res)=>{   
	var fid = req.query.facultyId;
	var fem = req.query.facultyEmail;
	var res;
	if ( fid != null ) {
		res = thePassFactory.theSchoolFactory.theFacultyHandler.theFaculty.get(parseInt(fid));
	} else {
		res = thePassFactory.theSchoolFactory.theFacultyHandler.theFacultyByEmail.get(fem);
	}
	if ( res==null ) { res="not found"; }
	res.status(200).send("Here->" + JSON.stringify(res)); 	
});
console.log("get_master_schedule_for");

app.get('/get_master_schedule_for', (req, res)=>{   
	var pd = req.query.courseView;
	res.status(200).send("Here->" + JSON.stringify(thePassFactory.theSchoolFactory.theMasterScheduleHandler.theMasterSchedule.get(pd))); 
	
});
console.log("get_student_for");
app.get('/get_student_for', (req, res)=>{   
	var pd = req.query.studentId;
	console.log("getting student for->"+ pd);
	res.status(200).send("Here->" + JSON.stringify(thePassFactory.theSchoolFactory.theStudentHandler.theStudents.get(parseInt(pd)))); 
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
		try {
			await thePassFactory.initialize( data.forDate);
			console.log("DONE INITIALIZING PASSFACTORY");
		} catch(e) {
			console.log("ERRORx->" + e.stack);
		}
		res.status(200).send(JSON.stringify(DataIntegrity.issues)); 	
	} )();
});
app.post("/email_passes", (req, res)=>{   
	(async() =>  { 
	
		console.log("in email_passes");
		try {
			await thePassFactory.emailPasses();
			console.log("EMAIL PASSES");
		} catch(e) {
			console.log("ERRORx->" + e.stack);
		}
		res.status(200).send({"message" : "success"}); 	
	} )();
});
app.post("/email_test_passes", (req, res)=>{   
	(async() =>  { 
	
		console.log("in email_test_passes");
		try {
			await thePassFactory.emailTestStudentPass();
			console.log("EMAIL TEST PASSES");
		} catch(e) {
			console.log("ERRORx->" + e.stack);
		}
		res.status(200).send({"message" : "success"}); 	
	} )();
});
console.log("get_student_data");
app.post("/get_student_data", (req, res)=>{   
	console.log("in get_student_data call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		res.status(200).send(JSON.stringify(Array.from(thePassFactory.theSchoolFactory.theStudentHandler.theStudents.values()))); 	
	} )();
});
console.log("get_student_block_names");

app.post("/get_student_block_names", (req, res)=>{   
	console.log("in get_student_block_names call");
	(async() =>  { 
		var j = JSON.stringify(req.body);
		var data = JSON.parse(j);
		var rr= Array.from(thePassFactory.theSchoolFactory.theMasterScheduleHandler.allStudentBlockNames.entries()); 	
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
app.post("/run_prod_batch", (req, res)=>{   
	console.log("in run_prod_batch");

	(async() =>  { 
		// Try loading data maxTries times.
		var maxTries=3;
		var atTry=1;
		var stillTrying = true;
		res.status(200).send(JSON.stringify({"message":"Kicked Job Off"})); 
		while ( stillTrying )  {
			
			try {
				var x = new Date();
				/* if after 2pm then add a day. */
				console.log("hours->" + x.getHours());
				if ( x.getHours() >= 13 ) {
					x.setDate(x.getDate()+1);
				}
				console.log("x->" + x);
				var y = x.getFullYear();
				var m = x.getMonth(); m++; if ( m.toString().length == 1) { m="0" + m.toString();} 
				var d = x.getDate(); if ( d.toString().length == 1 ) { d = "0" + d.toString();}
				var dtStr = y + "-" + m + "-" + d ;				
				console.log("Running Prod with ->"  + dtStr);
				thePassFactory = new PassFactory();
				await thePassFactory.initialize( dtStr );
				console.log("DONE INITIALIZING PASSFACTORY At Try#->" + atTry);			
				if ( ! BlockCalculator.isADay() && !BlockCalculator.isBDay() ) {
					console.log("not a school day");
					var rr=await thePassFactory.theEmailHandler.sendProdStatusEmail("Non School Day","Production ran but it is not a school day (" + dtStr + ")  so no mailings."); 	
					stillTrying = false;
				} else {
					var j = JSON.stringify(req.body);
					var data = JSON.parse(j);
					if ( data.flag == "ERROR") {
						var e = new Error("test");
						throw e;
					}
					console.log("EMAILING PASSES");

					var resStr=await thePassFactory.emailPassesWithRetry(3);
					console.log("DONE EMAILING PASSES");
					var rr=await thePassFactory.theEmailHandler.sendProdStatusEmail("PassFactory: Success" ,"Emails successful on try#->" + atTry + "\n" + resStr);
					stillTrying=false;
				}
			} catch ( e ) {
				console.log(e.stack);
				var rr=await thePassFactory.theEmailHandler.sendProdStatusEmail("Error",e.stack);
				if ( atTry < maxTries ) {					
					stillTrying=true;
				} else {
					stillTrying=false;
				}
				atTry++;
			}
		}
	} )();
	console.log("leaving prod run");
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


