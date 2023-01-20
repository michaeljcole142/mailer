/*
 * The student handler is the collection of students.  They
 * are in a map based on the id of the student.
 */
const Faculty = require('./faculty');
const DataLoader = require('./data_loader');
const DataIntegrity = require('./data_integrity');

class FacultyHandler {
	
	constructor() {
		this.theFaculty = new Map();
		this.theFacultyByEmail = new Map();

	}
	async initialize() {
		this.theFaculty = await DataLoader.getFacultyData();
		var fv = Array.from(this.theFaculty.values());
		for ( var i=0; i < fv.length; i++ ) {

			if ( this.theFacultyByEmail.has(fv[i].email) ) {
				//ignore null emails. already logged.
				if ( fv[i].email != null ) {
					DataIntegrity.addIssue("ERROR","FacultyHandler","initialize","Faculty Handler email exists on 2 records->" + JSON.stringify(fv[i]) + "<- and->" + JSON.stringify(this.theFacultyByEmail.get(fv[i].email)));
				}
			} else {
				this.theFacultyByEmail.set(fv[i].email,fv[i]);
			}
		}
	}
}
module.exports = FacultyHandler;