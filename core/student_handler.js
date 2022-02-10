/*
 * The student handler is the collection of students.  They
 * are in a map based on the id of the student.
 */
const Student = require('./student');
const DataLoader = require('./data_loader');

class StudentHandler {
	
	constructor() {
		this.theStudents = new Map();
	}	
	
	initialize() {
		this.theStudents = DataLoader.getStudentData();
	}
	

}
module.exports = StudentHandler;