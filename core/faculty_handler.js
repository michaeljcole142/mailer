/*
 * The student handler is the collection of students.  They
 * are in a map based on the id of the student.
 */
const Faculty = require('./faculty');
const DataLoader = require('./data_loader');

class FacultyHandler {
	
	constructor() {
		this.theFaculty = new Map();
	}
	initialize() {
		this.theFaculty = DataLoader.getFacultyData();
	}
	

}
module.exports = FacultyHandler;