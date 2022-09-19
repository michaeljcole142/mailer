/*
 * A Course represents the a specific course/class that a student can take.
 * This is not the specific block and day, it is the course.
 */
const DataIntegrity =  require('./data_integrity');

class Course {
	
	constructor(aId,aName,aDepartment,theRawSource) {
		this.id = parseInt(aId);
		this.name = aName;
		this.department = aDepartment;
		this.rawSource = theRawSource;
		if ( this.id == null || this.id == 0 ) {
			DataIntegrity.addIssue("ERROR","Course","constructor","Course Contructor adding empty Id for->" + JSON.stringify(this));
		}
		if ( this.name == null ) {
			DataIntegrity.addIssue("ERROR", "Course","constructor","Course Contructor adding empty name for->" + JSON.stringify(this));
		}		
	}	
	
}
module.exports = Course;