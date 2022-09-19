/*
 * Master Schedule represents an instance of a 
 * course.
 */
const DataIntegrity =  require('./data_integrity');

class MasterSchedule {

	constructor(aId,aRoom,aDescription,aScheduleDisplay,aTerm,aPrimaryEmail,theRawSource) {
		this.id = parseInt(aId);
		this.room = aRoom;
		this.description = aDescription;
		this.scheduleDisplay=aScheduleDisplay;
		this.term=aTerm;
		this.primaryEmail = aPrimaryEmail;
		this.rawSource = theRawSource;
		
		if ( this.id == null || this.id == 0 ) {
			DataIntegrity.addIssue("ERROR","MasterSchedule","constructor", "MasterSchedule Contructor adding empty Id for->" + JSON.stringify(this));
		}
		if ( this.room == null ) {
			DataIntegrity.addIssue("ERROR","MasterSchedule","constructor",  "MasterSchedule Contructor adding empty name for->" + JSON.stringify(this));
		}
		if ( this.description == null ) {
			DataIntegrity.addIssue("ERROR","MasterSchedule","constructor",  "MasterSchedule Contructor adding empty description for->" + JSON.stringify(this));
		}
		if ( this.scheduleDisplay == null ) {
			DataIntegrity.addIssue("ERROR","MasterSchedule","constructor",  "MasterSchedule Contructor adding empty scheduleDisplay for->" + JSON.stringify(this));
		} 
		if ( this.term == null ) {
			DataIntegrity.addIssue("ERROR", "MasterSchedule","constructor", "MasterSchedule Contructor adding empty term for->" + JSON.stringify(this));
		}
		if ( this.primaryEmail == null ) {
			DataIntegrity.addIssue("ERROR", "MasterSchedule","constructor", "MasterSchedule Contructor adding empty primaryEmail for->" + JSON.stringify(this));
		}
	}

}
module.exports = MasterSchedule;