/*
 * The pass handler is the collection of passes
 * that need to be sent out.
 */
const Pass =  require('./pass');
const DataLoader = require('./data_loader');
const BlockCalculator = require('./block_calculator');


class PassHandler {
	
	constructor() {
		this.thePasses = new Map();
	}	
	
	async initialize() {
		this.thePasses = await DataLoader.getPassData();
	}
	/*
	 * decorate adds instance objects  
	 */
	decorate(studentMap,teacherMap) {
		
		var passesArray = Array.from(this.thePasses.values());
		for ( var i=0; i < passesArray.length; i++ ) {
			var passAt = passesArray[i];
			/* decorate student */
			var student = studentMap.get(passAt.studentId);
			if ( student == null ) {
				DataIntegrity.addIssue("ERROR","PassHandler","decorate","Can't find student->" + passAt.studentId + " for pass->" + passAt.id);
			} else {
				passAt.student = student;
			}
			var from = BlockCalculator.getBlockInfo(passAt.dateTime);
			passAt.fromBlock=student.getScheduleBlock(from);
			
		}
		return;
	}	
}
module.exports = PassHandler;