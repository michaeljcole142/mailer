/*
 * A Pass represents the a specific ask from a faculty member to
 * a student to visit them at a specified time and location.
 */
class Pass {
	
	constructor(aId,aStudentId,aDateTime,aNote) {
		this.id = parseInt(aId);
		this.studentId = parseInt(aStudentId);
		this.student = null;
		this.fromBlock = null; 
		this.homeRoomBlock = null;
		this.dateTime = aDateTime;
		this.note = aNote;
	}	
	
}
module.exports = Pass;