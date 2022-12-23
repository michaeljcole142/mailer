/*
 * A Factulty represents any factulty of the school.
 * Examples would be teachers, councelors, coaches, etc.
 */
const Schedule =  require('./schedule');
const DataIntegrity =  require('./data_integrity');

class Faculty {
	
	constructor(aId,aName,aFirstName,aLastName,aEmail,aDepartment,theRawSource){
		this.id = aId;
		this.name = aName;
		this.fName = aFirstName;
		this.lName = aLastName;
		this.email = aEmail;
		this.department = aDepartment;
		this.rawSource = theRawSource;
		this.theSchedule = new Schedule(aId);
		if ( this.id == null || this.id == 0 ) {
			DataIntegrity.addIssue("ERROR", "Faculty","constructor","Faculty Contructor adding empty Id for->" + JSON.stringify(this));
		}
		if ( this.name == null ) {
			DataIntegrity.addIssue("ERROR","Faculty","constructor", "Faculty Contructor adding empty name for->" + JSON.stringify(this));
		}	
		if ( this.email == null ) {
			DataIntegrity.addIssue("ERROR", "Faculty","constructor","Faculty Contructor adding empty email for->" + JSON.stringify(this));
		}	
	}	
	
}
module.exports = Faculty;