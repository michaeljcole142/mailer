/*
 * The Pass Factory is the main engine that runs and handles all calls from the server and
 * does coordination across the handler classes.
 */

const StudentHandler = require('./student_handler');
const Student = require('./student');
const FacultyHandler = require('./faculty_handler');
const CourseHandler = require('./course_handler');
const BlockHandler = require('./block_handler');
const PassHandler = require('./pass_handler');
const DataIntegrity = require('./data_integrity');
const EmailHandler = require('./email_handler');
const ProdMode = require('./prod_mode');
const MasterScheduleHandler = require('./master_schedule_handler');
const BlockCalculator = require('./block_calculator');
const DataLoader = require('./data_loader');
const SchoolFactory = require('./school_factory');

class PassFactory {
	
	constructor() {
		this.theSchoolFactory = new SchoolFactory();
		this.thePassHandler = new PassHandler();
		this.theEmailHandler = new EmailHandler();
		this.sendEmail=true;
	}	
	
	async initialize(forDate) {
		console.log("in PassFactory.initialize()");
		/*
		 * First step of loading all the data and getting it ready
		 * to process is to initialize all the datasets from the loaders.
		 * Or read it in from it source.
		 */
		console.log("Initializing the School Factory...");
		await this.theSchoolFactory.initialize(forDate);

		await this.thePassHandler.initialize(forDate);
		console.log("\tFinished initializing thePassHandler for " + forDate + "...");
		/*
		 * Decorating the data means, that we lookup instances of objects
		 * and put them with the containers that refernce them.
		 * For example, if a block had student #1 in its student list,
		 * then we lookup student 1 and make sure they exist. Then add them to
		 * the object as a full student object.
		 */
		console.log("Decorating the data objects....");
		await this.decorateDataObjects();
		console.log("Finished Decorating the data objects...");
		//DataIntegrity.print();
	}
	async decorateDataObjects() {
		/* 
		 * populate Block objects with the instance of the teacher
		 * and students for the id's loaded.  Returns a set of referential
		 * integrity problems.  
		 */
		await this.theSchoolFactory.decorateDataObjects();
		await this.thePassHandler.decorate(
			this.theSchoolFactory.theStudentHandler.theStudents);
	}
	printPasses() {
		var p=Array.from(this.thePassHandler.thePasses.values());
		for ( var i=0; i < p.length; i++ ) {
			console.log("pass->" + JSON.stringify(p[i]));
		}
	}
	async emailPasses() {
console.log("emailingPasses");

		// this is the student section.
		var passes = await this.getDecoratedPasses();
		var teacherHRList = new Map();
		var teacherFromList = new Map();
		var masterTeacherList = new Map();
		console.log("sending student email passes to " + passes.length + " students");
		var studentCt=0;
		var teacherCt=0;
		for ( var i=0; i < passes.length; i++ ) {
			var passAt = passes[i];	
			studentCt++;
			if ( this.sendEmail &&  passAt.student != null ) {
				console.log("send student email number->" + studentCt + " to->" + passAt.student.email);
				await this.theEmailHandler.sendPassToStudent(passAt);
				console.log("sleeping...");
				await sleep(3000);
				console.log("woke up...");
			}
			if ( passAt.homeRoomTeacher != null ) {
				var at = teacherHRList.get(passAt.homeRoomTeacher.id);
				if ( at == null ) {
					var l=[];
					l.push(passAt);
					teacherHRList.set(passAt.homeRoomTeacher.id,l);
				} else {
					at.push(passAt);
					teacherHRList.set(passAt.homeRoomTeacher.id,at);
				}
				//master list transition
				var atM = masterTeacherList.get(passAt.homeRoomTeacher.id);
				if ( atM == null ) {
					var notify={};
					notify.homeRoomList = [passAt];
					notify.blockLeaveList = [];
					masterTeacherList.set(passAt.homeRoomTeacher.id,notify);
				} else {
					atM.homeRoomList.push(passAt);
					masterTeacherList.set(passAt.homeRoomTeacher.id,atM);
				}
			}
			if ( passAt.fromRoomTeacher != null ) {
				var at = teacherFromList.get(passAt.fromRoomTeacher.id);
				if ( at == null ) {
					teacherFromList.set(passAt.fromRoomTeacher.id,[passAt]);
				} else {
					at.push(passAt);
					teacherFromList.set(passAt.fromRoomTeacher.id,at);
				}
				//master list transition
				var atM = masterTeacherList.get(passAt.fromRoomTeacher.id);
				if ( atM == null ) {
					var notify={};
					notify.homeRoomList = [];
					notify.blockLeaveList = [passAt];
					masterTeacherList.set(passAt.fromRoomTeacher.id,notify);
				} else {
					atM.blockLeaveList.push(passAt);
					masterTeacherList.set(passAt.fromRoomTeacher.id,atM);
				}
			}
		}
		console.log("sent emails to students->" + studentCt + " totalPasses->" + passes.length);
		console.log("send email flag->" + this.sendEmail);
		var tt=Array.from(masterTeacherList);
		console.log("#######################");
		
		for (var i=0; i < tt.length; i++ ) {
		//	console.log("##->" + JSON.stringify(tt[i]));
			var teacherAt = this.theSchoolFactory.theFacultyHandler.theFaculty.get(parseInt(tt[i][0]));
			await this.theEmailHandler.sendTeacherEmail(teacherAt,tt[i][1]);
			await sleep(3000);
		}
		console.log("#########################");
		console.log("sent emails to teachers->" + tt.length);
		
	}
	
	async emailTestStudentPass() {
		var passes = await this.getDecoratedPasses();
console.log("emailTestStudentPass");
		var testPass=passes[0];
		var oe=testPass.student.email;
		testPass.student.email="michael.cole@hcrhs.org";
		await this.theEmailHandler.sendPassToStudent(testPass);
		testPass.student.email=oe;
	}	
		
	async getDecoratedPasses() {
		var dp = [];
		var passes = Array.from(this.thePassHandler.thePasses.values());
		for ( var i=0; i < passes.length; i++ ) {
			var here=false;	
			var facultyAt=null;
			if ( passes[i].student != null ) {
				if ( passes[i].homeRoomBlock == null ) {
					console.log("ERROR:NO HOMEROOM BLOCK FOR PASS->" + JSON.stringify(passes[i].homeRoomBlock));
					console.log("STUDENT IS->" + JSON.stringify(passes[i].student));
				} else {
				
					passes[i].homeRoomNumber = passes[i].homeRoomBlock.room;
					passes[i].homeRoomTeacher = this.theSchoolFactory.theFacultyHandler.theFacultyByEmail.get(passes[i].homeRoomBlock.primaryEmail);
					if ( passes[i].fromBlock != null ) {
						passes[i].fromRoomNumber = passes[i].fromBlock.room;
						passes[i].fromRoomTeacher = this.theSchoolFactory.theFacultyHandler.theFacultyByEmail.get(passes[i].fromBlock.primaryEmail);
					}
				}
	
			} else {
				console.log("ERROR:  Can not send pass to empty students->" + JSON.stringify(passes[i]));

			}
		}
		return passes;
	}
	async emailPassesWithRetry(numRetries) {
console.log("emailingPassesWithRetry");
		var resString="";
		// this is the student section.
		var passes = await this.getDecoratedPasses();
		var teacherHRList = new Map();
		var teacherFromList = new Map();
		var masterTeacherList = new Map();
		console.log("sending student email passes to " + passes.length + " students");
		var studentCt=0;
		var teacherCt=0;
		for ( var i=0; i < passes.length; i++ ) {
			var passAt = passes[i];	
			if ( this.sendEmail &&  passAt.student != null ) {
				// Here we loop to try failing emails the numRetries
				// times.
				var tryAt=1;
				var keepTrying=true;
				while ( keepTrying == true ) {
					try {
						console.log("send student email number->" + studentCt + " to->" + passAt.student.email);
						await this.theEmailHandler.sendPassToStudent(passAt);
						console.log("sleeping...");
						await sleep(3000);
						console.log("woke up...");
						keepTrying = false;
						studentCt++;
					} catch ( e ) {
						console.log("failed to send email number->" +  studentCt + " rety->" + tryAt);
						tryAt++;
						console.log("e->" + e.stack);
						if ( tryAt > numRetries ) {
							console.log("stopped trying");
							keepTrying=false;
						}
					}
				}
			}
			if ( passAt.homeRoomTeacher != null ) {
				var at = teacherHRList.get(passAt.homeRoomTeacher.id);
				if ( at == null ) {
					var l=[];
					l.push(passAt);
					teacherHRList.set(passAt.homeRoomTeacher.id,l);
				} else {
					at.push(passAt);
					teacherHRList.set(passAt.homeRoomTeacher.id,at);
				}
				//master list transition
				var atM = masterTeacherList.get(passAt.homeRoomTeacher.id);
				if ( atM == null ) {
					var notify={};
					notify.homeRoomList = [passAt];
					notify.blockLeaveList = [];
					masterTeacherList.set(passAt.homeRoomTeacher.id,notify);
				} else {
					atM.homeRoomList.push(passAt);
					masterTeacherList.set(passAt.homeRoomTeacher.id,atM);
				}
			}
			if ( passAt.fromRoomTeacher != null ) {
				var at = teacherFromList.get(passAt.fromRoomTeacher.id);
				if ( at == null ) {
					teacherFromList.set(passAt.fromRoomTeacher.id,[passAt]);
				} else {
					at.push(passAt);
					teacherFromList.set(passAt.fromRoomTeacher.id,at);
				}
				//master list transition
				var atM = masterTeacherList.get(passAt.fromRoomTeacher.id);
				if ( atM == null ) {
					var notify={};
					notify.homeRoomList = [];
					notify.blockLeaveList = [passAt];
					masterTeacherList.set(passAt.fromRoomTeacher.id,notify);
				} else {
					atM.blockLeaveList.push(passAt);
					masterTeacherList.set(passAt.fromRoomTeacher.id,atM);
				}
			}
		}
		var sStr = "sent emails to students->" + studentCt + " for total student passes->" + passes.length;
		console.log(sStr);
		var resString = resString + "\n" + sStr;
		console.log("send email flag->" + this.sendEmail);
		var tt=Array.from(masterTeacherList);
		var tCount=0;
		console.log("#######################");
		for (var i=0; i < tt.length; i++ ) {
			console.log("##->" + JSON.stringify(tt[i]));
			var tryAt=1;
			var keepTrying=true;
			while ( keepTrying == true ) {
				try {
					var teacherAt = this.theSchoolFactory.theFacultyHandler.theFaculty.get(parseInt(tt[i][0]));

					await this.theEmailHandler.sendTeacherEmail(teacherAt,tt[i][1]);
					await sleep(3000);
					keepTrying=false;
					tCount++;
				} catch (e) {
					console.log("failed to send email number->" +  studentCt + " rety->" + tryAt);
					tryAt++;
					console.log("e->" + e.stack);
					if ( tryAt > numRetries ) {
						console.log("stopped trying");
						keepTrying=false;
					}
				}
			}
		}
		console.log("#########################");
		var tStr = "sent emails to teachers->" + tCount + " for expected->" + tt.length;
		console.log(tStr);
		resString = resString + "\n" + tStr;
		return resString;
	}
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = PassFactory;