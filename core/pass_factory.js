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


class PassFactory {
	
	constructor() {
		
		this.theProdMode = null;
		this.theStudentHandler = null;
		this.theFacultyHandler = null;
		this.theCourseHandler = null;
		this.theBlockHandler = null;
		this.theMasterScheduleHandler = null;
		this.thePassHandler = null;
		this.theEmailHandler = new EmailHandler();
		this.sendEmail=false;
	}	
	
	async initialize(forDate) {
		console.log("in PassFactory.initialize()");
		this.theProdMode = new ProdMode();
		var abDay = await DataLoader.getABDay(forDate);
		console.log("ABDAY----->" + abDay);
		BlockCalculator.setABDay(abDay);
		
		this.forDate = forDate;
		
		this.theStudentHandler = new StudentHandler();
		this.theFacultyHandler = new FacultyHandler();
		this.theCourseHandler = new CourseHandler();
		this.theBlockHandler = new BlockHandler();
		this.theMasterScheduleHandler = new MasterScheduleHandler();
		this.thePassHandler = new PassHandler();


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
		await this.decorateDataObjects();
		console.log("Finished Decorating the data objects...");
		DataIntegrity.print();
		
		this.emailPasses();
	}
	async decorateDataObjects() {
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

		await this.thePassHandler.decorate(
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
		// this is the student section.
		var passes = await this.getDecoratedPasses();
		var teacherList = new Map();
		console.log("sending email passes to " + passes.length + " students");
		var studentCt=0;
		var teacherCt=0;
		for ( var i=0; i < passes.length; i++ ) {
			var passAt = passes[i];
			
			studentCt++;
			if ( this.sendEmail ) {
				this.theEmailHandler.sendPassToStudent(passAt);
			}
			if ( passAt.homeRoomTeacher != null ) {
				var at = teacherList.get(passAt.homeRoomTeacher.id);
				if ( at == null ) {
					teacherList.set(passAt.homeRoomTeacher.id,[passAt]);
				} else {
					at.push(passAt);
					teacherList.set(passAt.homeRoomTeacher.id,at);
				}
			}
		}	
		console.log("teacher count->" + teacherList.size);
		console.log("passes length->" + passes.length);
		var teacher=Array.from(teacherList.entries());
		for ( var i=0; i < teacher.length; i++ ) {
			teacherCt++;
			var teacherAt = this.theFacultyHandler.theFaculty.get(parseInt(teacher[i][0]));
			if ( teacherAt != null && teacherAt.email != null) {
				if ( this.sendEmail == true ) {
					this.theEmailHandler.sendHRTeacher(teacherAt,teacher[i][1]);
				}
			}
		}
		console.log("sent emails to students->" + studentCt);
		console.log("sent emails to teachers->" + teacherCt);
		console.log("send email flag->" + this.sendEmail);
	}
	async getDecoratedPasses() {
		var dp = [];
		var passes = Array.from(this.thePassHandler.thePasses.values());
		for ( var i=0; i < passes.length; i++ ) {
			var here=false;	
			var facultyAt=null;
			if ( passes[i].student != null ) {
				if ( BlockCalculator.isADay() ) {
					if ( passes[i].student.theSchedule.ADayBlocks[0] != null ) {
						passes[i].homeRoomNumber=passes[i].student.theSchedule.ADayBlocks[0].room;
						passes[i].homeRoomTeacher = this.theFacultyHandler.theFacultyByEmail.get(passes[i].student.theSchedule.ADayBlocks[0].primaryEmail);
					}
				} else {
					if ( passes[i].student.theSchedule.BDayBlocks[0] != null ) {
						passes[i].homeRoomNumber=passes[i].student.theSchedule.BDayBlocks[0].room;
						passes[i].homeRoomTeacher = this.theFacultyHandler.theFacultyByEmail.get(passes[i].student.theSchedule.BDayBlocks[0].primaryEmail);				
					}
				}
			} else {
				console.log("ERROR:  Can not send pass to empty students->" + JSON.stringify(passes[i]));

			}
		}
		return passes;
	}
}
module.exports = PassFactory;