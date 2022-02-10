/*
 * A Factulty represents any factulty of the school.
 * Examples would be teachers, councelors, coaches, etc.
 */
const Schedule =  require('./schedule');

class Faculty {
	
	constructor(aId,aName,aEmail) {
		this.id = aId;
		this.name = aName;
		this.email = aEmail;
		this.theSchedule = new Schedule(aId);
	}	
	
}
module.exports = Faculty;