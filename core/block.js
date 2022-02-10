/*
 * A Block represents the a specific instance of a course/class that a student
 * is taking and a faculty member is teaching.
 */
 
class Block {

	constructor(aId,aRoom,aBlock,aDay,aCourseId,aTeacherId,theStudents) {
		this.id = aId;				//I do not know if there is an id for a block in aspen.
									// it is probably a combo of the room, class, block, day as key.
		this.room = aRoom; 			// this is the room# for the class.
		this.blockNum = aBlock;		// this is a block number 1-5.
		this.day = aDay; 			// I think some courses are every day. 
									// Have to think that thru.
									// else this is a A or B value.
		
		this.courseId = parseInt(aCourseId); 	// this is the course number.
		this.course = null; 
		
		this.teacherId = parseInt(aTeacherId);// this is the id of the teacherId
		this.teacher = null;
		
		this.studentIds = theStudents;// this is an array of student id's taking the class.
		
		this.students = new Map();
	}	
	
}
module.exports = Block;