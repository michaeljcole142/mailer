/*
 * A Student represents the students of the school.
 */
const Schedule =  require('./schedule');

class Student {
	
	constructor(aId,aName,aEmail) {
		this.id = aId;
		this.name = aName;
		this.email = aEmail;
		this.theSchedule = new Schedule(aId);
	}	
	getScheduleBlock(blockName) {
		return this.theSchedule.getBlock(blockName);
	}
	
}
module.exports = Student;