/*
 * A Course represents the a specific course/class that a student can take.
 * This is not the specific block and day, it is the course.
 */
 
class Course {
	
	constructor(aId,aName,aDepartment) {
		this.id = parseInt(aId);
		this.name = aName;
		this.department = aDepartment;
	}	
	
}
module.exports = Course;