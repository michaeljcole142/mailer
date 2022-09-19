/*
 * A Student represents the students of the school.
 */
const Schedule =  require('./schedule');
const DataIntegrity =  require('./data_integrity');

class Student {
	
	constructor(aId,aName,aEmail,theRawSource) {
		this.id = aId;
		this.name = aName;
		this.email = aEmail;
		this.rawSource=theRawSource;
		this.theSchedule = new Schedule(aId);
		if ( this.id == null || this.id == 0 ) {
			DataIntegrity.addIssue("ERROR","Student","constructor", "Student Contructor adding empty Id for->" + JSON.stringify(this));
		}
		if ( this.name == null ) {
			DataIntegrity.addIssue("ERROR","Student","constructor",  "Student Contructor adding empty name for->" + JSON.stringify(this));
		}	
		if ( this.email == null ) {
			DataIntegrity.addIssue("ERROR", "Student","constructor", "Student Contructor adding empty email for->" + JSON.stringify(this));
		}	
	}	
	getScheduleBlock(blockName) {
		return this.theSchedule.getBlock(blockName);
	}
	
}
module.exports = Student;