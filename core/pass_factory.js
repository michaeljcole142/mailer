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


class PassFactory {
	
	constructor() {
		
		this.theProdMode = new ProdMode();
		this.theStudentHandler = new StudentHandler();
		this.theFacultyHandler = new FacultyHandler();
		this.theCourseHandler = new CourseHandler();
		this.theBlockHandler = new BlockHandler();
		this.thePassHandler = new PassHandler();
		this.theEmailHandler = new EmailHandler();

	}	
	
	initialize() {
		/*
		 * First step of loading all the data and getting it ready
		 * to process is to initialize all the datasets from the loaders.
		 * Or read it in from it source.
		 */
		console.log("Initializing the Pass Factory...");
		console.log("\tInitializing theStudentHandler...");
		this.theStudentHandler.initialize();
		console.log("\tFinished initializing theStudentHandler...");
		console.log("\tInitializing theFacultyHandler...");
		this.theFacultyHandler.initialize();
		console.log("\tFinished initializing theFacultyHandler...");
		console.log("\tInitializing theCourseHandler...");
		this.theCourseHandler.initialize();
		console.log("\tFinished initializing theCourseHandler...");
		console.log("\tInitializing theBlockHandler...");
		this.theBlockHandler.initialize();
		console.log("\tFinished initializing theBlockHandler...");
		console.log("\tInitializing thePassHandler...");
		this.thePassHandler.initialize();
		console.log("\tFinished initializing thePassHandler...");
		/*
		 * Decorating the data means, that we lookup instances of objects
		 * and put them with the containers that refernce them.
		 * For example, if a block had student #1 in its student list,
		 * then we lookup student 1 and make sure they exist. Then add them to
		 * the object as a full student object.
		 */
		console.log("Decorating the data objects....");
		this.decorateDataObjects();
		console.log("Finished Decorating the data objects...");
		
		this.emailPasses();
	}
	decorateDataObjects() {
		/* 
		 * populate Block objects with the instance of the teacher
		 * and students for the id's loaded.  Returns a set of referential
		 * integrity problems.  
		 */
		 this.theBlockHandler.decorate(
			this.theStudentHandler.theStudents,
			this.theFacultyHandler.theFaculty,
			this.theCourseHandler.theCourses);
			
		this.thePassHandler.decorate(
			this.theStudentHandler.theStudents);
			
		DataIntegrity.print();
		
		console.log("passes->" + JSON.stringify(Array.from(this.thePassHandler.thePasses)));
	}
	async emailPasses() {
		var passes = Array.from(this.thePassHandler.thePasses);
		for ( var i=0; i < passes.length; i++ ) {
			var passAt = passes[i][1];
			this.theEmailHandler.sendPassToStudent(passAt);
		}	
	}
		
}
module.exports = PassFactory;