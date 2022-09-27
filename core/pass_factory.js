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


class PassFactory {
	
	constructor() {
		
		this.theProdMode = null;
		this.theStudentHandler = null;
		this.theFacultyHandler = null;
		this.theCourseHandler = null;
		this.theBlockHandler = null;
		this.theMasterScheduleHandler = null;
		this.thePassHandler = null;
		this.theEmailHandler = null;
	}	
	
	async initialize(abDay,forDate) {
		BlockCalculator.setABDay(abDay);
		this.forDate = forDate;
		this.theProdMode = new ProdMode();
		this.theStudentHandler = new StudentHandler();
		this.theFacultyHandler = new FacultyHandler();
		this.theCourseHandler = new CourseHandler();
		this.theBlockHandler = new BlockHandler();
		this.theMasterScheduleHandler = new MasterScheduleHandler();
		this.thePassHandler = new PassHandler();
		this.theEmailHandler = new EmailHandler();
		/*
		 * First step of loading all the data and getting it ready
		 * to process is to initialize all the datasets from the loaders.
		 * Or read it in from it source.
		 */
		console.log("Initializing the Pass Factory...");
		console.log("\tInitializing theStudentHandler...");
		await this.theStudentHandler.initialize();
		console.log("\tFinished initializing theStudentHandler...");
		console.log("\tInitializing theFacultyHandler...");
		await this.theFacultyHandler.initialize();
		console.log("\tFinished initializing theFacultyHandler...");
		console.log("\tInitializing theCourseHandler...");
		await this.theCourseHandler.initialize();
		console.log("\tFinished initializing theCourseHandler...");
//		console.log("\tInitializing theBlockHandler...");
//		await this.theBlockHandler.initialize();
//		console.log("\tFinished initializing theBlockHandler...");
		console.log("\tInitializing theMasterScheduleHandler...");
		await this.theMasterScheduleHandler.initialize();
		console.log("\tFinished initializing theMasterScheduleHandler...");
		console.log("\tInitializing thePassHandler...");
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
//		this.decorateDataObjects();
		console.log("Finished Decorating the data objects...");
//		DataIntegrity.print();
		this.decorateDataObjects();
		
		this.emailPasses();
	}
	decorateDataObjects() {
		/* 
		 * populate Block objects with the instance of the teacher
		 * and students for the id's loaded.  Returns a set of referential
		 * integrity problems.  
		 */
		 /*
		 this.theBlockHandler.decorate(
			this.theStudentHandler.theStudents,
			this.theFacultyHandler.theFaculty,
			this.theCourseHandler.theCourses);
*/		this.theMasterScheduleHandler.decorate(
			this.theFacultyHandler.theFacultyByEmail,this.theStudentHandler.theStudents);			

		this.thePassHandler.decorate(
			this.theStudentHandler.theStudents);
		
//		DataIntegrity.print();
//		this.printPasses();
	}
	printPasses() {
		var p=Array.from(this.thePassHandler.thePasses.values());
		for ( var i=0; i < p.length; i++ ) {
			console.log("pass->" + JSON.stringify(p[i]));
		}
	}
	async emailPasses() {
		var passes = Array.from(this.thePassHandler.thePasses);
//		for ( var i=0; i < passes.length; i++ ) {
		for ( var i=0; i < 1; i++ ) {
			var passAt = passes[i][1];
			this.theEmailHandler.sendPassToStudent(passAt);
		}	
	}
	async getDecoratedPasses() {
		var dp = [];
		var passes = Array.from(this.thePassHandler.thePasses.values());
		for ( var i=0; i < passes.length; i++ ) {
			var here=false;
			var dpi={};
			
			dpi.studentId=passes[i].studentId;
			dpi.dateTime=passes[i].dateTime;
			dpi.note=passes[i].note;
			var studentAt = this.theStudentHandler.theStudents.get(passes[i].studentId);
			if ( studentAt != null ) {
				dpi.studentName=studentAt.name;			
				dpi.studentEmail=studentAt.email;			
				var facultyAt=null;
				if ( studentAt.theSchedule.ADayBlocks[0] != null ) {
					dpi.homeRoomNumber=studentAt.theSchedule.ADayBlocks[0].room;
					facultyAt = this.theFacultyHandler.theFacultyByEmail.get(studentAt.theSchedule.ADayBlocks[0].primaryEmail);
				}
				if ( facultyAt != null ) {
					dpi.homeRoomTeacherName=facultyAt.name;
					dpi.homeRoomTeacherEmail=facultyAt.email;
				}
			}
			dp.push(dpi); 
		}
		return dp;
	}
}
module.exports = PassFactory;