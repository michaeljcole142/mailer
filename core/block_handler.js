/*
 * The Block handler is the collection of Blocks that students and faculty are assigned
 * to on a daily basis.
 */
const Block =  require('./block');
const DataIntegrity =  require('./data_integrity');
const DataLoader = require('./data_loader');

class BlockHandler {
	
	constructor() {
		this.theBlocks = new Map();
	}	
	/*
	 * initialize will load the data into block objects and populate
	 * a hashmap of the blocks. The map id is the block id.
	 */
	async initialize() {
		this.theBlocks = await DataLoader.getBlockData();
	}	
	/*
	 * decorate adds instance objects of students and teaches to each block.
	 * They are initially loaded with their id's.  Any id not found is 
	 * pushed into a data loading integrity error list and returned.
	 */
	decorate(studentMap,teacherMap,courseMap) {
		var blockArray = Array.from(this.theBlocks.values());
		for ( var i=0; i < blockArray.length; i++ ) {
			var blockAt = blockArray[i];
			/* decorate teacher */
/* THIS DATA DOESN'T SEEM TO BE AVAILABLE
			var teacher = teacherMap.get(blockAt.teacherId);
			if ( teacher == null ) {
				DataIntegrity.addIssue("ERROR","BlockHandler","decorate","Can't find teacher->" + blockAt.teacherId + " for block->" + blockAt.id);
			} else {
				blockAt.teacher = teacher;
			}
*/
			/* decorate students */
/* DATA DOESN'T SEEM AVAILABLE
			for ( var ii=0; ii < blockAt.studentIds.length; ii++ ){ 
				var student = studentMap.get(blockAt.studentIds[ii]);
				if ( student == null ) {
					DataIntegrity.addIssue("ERROR","BlockHandler","decorate","Can't find student->" + blockAt.studentIds[ii] + " for block->" + blockAt.id);
				} else {
					blockAt.students.set(student.id, student);
					student.theSchedule.addBlock(blockAt);
				}
			}
*/
			/* decorate course */
			var course = courseMap.get(blockAt.courseId);
			if ( course == null ) {
				DataIntegrity.addIssue("ERROR","BlockHandler","decorate","Can't find course->" + blockAt.courseId + " for block->" + blockAt.id);
			} else {
				blockAt.course = course;
			}
			
		}
		return;
	}
}
module.exports = BlockHandler;