/*
 * The School Factory is the main engine that runs and handles all calls from the server and
 * does coordination across the handler classes.  It loads all the
 * school data.  For now, from aspen.
 */

const StudentHandler = require('./student_handler');
const RoomHandler = require('./room_handler');

const Student = require('./student');
const FacultyHandler = require('./faculty_handler');
const CourseHandler = require('./course_handler');
const BlockHandler = require('./block_handler');
const PassHandler = require('./pass_handler');
const DataIntegrity = require('./data_integrity');
const ProdMode = require('./prod_mode');
const MasterScheduleHandler = require('./master_schedule_handler');
const BlockCalculator = require('./block_calculator');
const DataLoader = require('./data_loader');


class SchoolFactory {
	
	constructor() {
		
		this.theProdMode = null;
		this.theStudentHandler = null;
		this.theFacultyHandler = null;
		this.theCourseHandler = null;
		this.theBlockHandler = null;
		this.theMasterScheduleHandler = null;
		this.theRoomHandler=null;
	}	
	
	async initialize(forDate) {
		console.log("in SchoolFactory.initialize()");
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
		this.theRoomHandler=new RoomHandler();


		/*
		 * First step of loading all the data and getting it ready
		 * to process is to initialize all the datasets from the loaders.
		 * Or read it in from it source.
		 */
		console.log("Initializing the Room Handler ...");
		await this.theRoomHandler.initialize();
		
		console.log("Initializing the School Factory...");
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
		this.theMasterScheduleHandler.decorate(
			this.theFacultyHandler.theFacultyByEmail,this.theStudentHandler.theStudents);			

	}
}
module.exports = SchoolFactory;