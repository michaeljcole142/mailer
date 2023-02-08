/*
 * The pass handler is the collection of passes
 * that need to be sent out.
 */
const Pass =  require('./pass');
const DataLoader = require('./data_loader');
const BlockCalculator = require('./block_calculator');
const DataIntegrity = require('./data_integrity');


class PassHandler {
	
	constructor() {
		this.thePasses = new Map();
		this.forDate=null;
	}	
	
	async initialize(forDate) {
		try {
			this.forDate=forDate;
			this.thePasses = await DataLoader.getPassData(forDate);
		} catch (e) {
			console.log("ERROR-->" + e.stack);
		}
	}
	/*
	 * decorate adds instance objects  
	 */
	async decorate(studentMap,teacherMap) {
		
		var passesArray = Array.from(this.thePasses.values());
		for ( var i=0; i < passesArray.length; i++ ) {
			var passAt = passesArray[i];
			/* decorate student */
			var student = studentMap.get(passAt.studentId);
			if ( student == null ) {
				DataIntegrity.addIssue("ERROR","PassHandler","decorate","Can't find student->" + passAt.studentId + " for pass->" + passAt.id);
			} else {
				passAt.student = student;

				var from = BlockCalculator.getBlockInfo(passAt.dateTime);
				passAt.fromBlock=student.getScheduleBlock(from);
				passAt.homeRoomBlock=student.getHomeRoomBlock(BlockCalculator.ABDay);
				this.thePasses.set(passAt.id,passAt);
			}
		}
		return;
	}	
}
module.exports = PassHandler;