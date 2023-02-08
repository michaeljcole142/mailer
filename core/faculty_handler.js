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
	getIt() {
		console.log("Suzzane->" + JSON.stringify(this.theFacultyByEmail.get('svrancke@hcrhs.org')));
		var x = Array.from(this.theFaculty.values());
		for ( var i=0; i < x.length; i++ ) {
			var s = x[i].theSchedule;
			for ( var d=0; d < 4; d++ ) {
				if ( s.ADayBlocks[d] != null && s.ADayBlocks[d].id ==129 ) {
					console.log("FOUND FOR->" + x[i].email );
					console.log("Block is->" + JSON.stringify(s.ADayBlocks[d]));
				}
				if ( s.BDayBlocks[d] != null && s.BDayBlocks[d].id == 129 ) {
					console.log("FOUND FOR B->" + x[i].email);
					console.log("Block is->" + JSON.stringify(s.BDayBlocks[d]));
				}
			}
		}
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