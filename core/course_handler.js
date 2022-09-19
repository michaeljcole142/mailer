/*
 * The course handler is the collection of courses available to students.  They
 * are in a map based on the id of the course. These are not instances of a class
 * in a classroom.  This is the collection of distinct courses available to a student.
 */
const Course =  require('./course');
const DataLoader = require('./data_loader');

class CourseHandler {
	
	constructor() {
		this.theCourses = new Map();
	}	
	
	async initialize() {
		this.theCourses = await DataLoader.getCourseData();
	}	
}
module.exports = CourseHandler;