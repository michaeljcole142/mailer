/*
 * The student handler is the collection of students.  They
 * are in a map based on the id of the student.
 */
const Student = require('./student');
const DataLoader = require('./data_loader');
const DataIntegrity = require('./data_integrity');

class StudentHandler {
	
	constructor() {
		this.theStudents = new Map();
		this.theStudentsByEmail = new Map();
	}	
	
	async initialize() {
		this.theStudents = await DataLoader.getStudentData();
		var sv = Array.from(this.theStudents.values());

		for ( var i=0; i < sv.length; i++ ) {
			if ( this.theStudentsByEmail.has(sv[i].email) ) {
				//ignore null emails. already logged.
				if ( sv[i].email != null ) {
					DataIntegrity.addIssue("ERROR","StudentHandler","initialize","Student Handler email exists on 2 records->" + JSON.stringify(sv[i]) + "<- and->" + JSON.stringify(this.theStudentsByEmail.get(sv[i].email)));
				}
			} else {
				this.theStudentsByEmail.set(sv[i].email,sv[i]);
			}
		}
	}
	

}
module.exports = StudentHandler;