/*
 * The Master Schedule handler is the collection of Master Schedule course instances that students and faculty are assigned
 * to on a daily basis.
 */
const Block =  require('./block');
const DataIntegrity =  require('./data_integrity');
const DataLoader = require('./data_loader');

class MasterScheduleHandler {
	
	

	constructor() {
		this.theMasterSchedule = new Map();
		this.theStudentBlocksSource = [];
		this.allStudentBlockNames = new Map();
	}	
	/*
	 * initialize will load the data into master schedule objects and populate
	 * a hashmap of the master schedule items. The map id is the course view from aspen.
	 */
	async initialize() {
		this.theMasterSchedule = await DataLoader.getMasterScheduleData();
		this.theStudentBlocksSource = await DataLoader.getStudentBlockData();
	}	
	/*
	 * decorate adds instance objects of students and teaches to each block.
	 * They are initially loaded with their id's.  Any id not found is 
	 * pushed into a data loading integrity error list and returned.
	 */
	decorate(teacherMapByEmail,theStudents) {
		var msv = Array.from(this.theMasterSchedule.values());
		var notfound = 0;
		for (var i=0; i < msv.length; i++ ) {
			if ( msv[i].primaryEmail != null ) {
				var ta=teacherMapByEmail.get(msv[i].primaryEmail);
				if (ta == null ) { 
					notfound++;
				} else {
					ta.theSchedule.setBlocks(msv[i]);
				}
			}
			var em = msv[i].primaryEmail;
		}
		var bs = Array.from(this.theMasterSchedule.values());
		for ( var i=0; i < bs.length; i++ ) {
			var b = this.allStudentBlockNames.get(bs[i].scheduleDisplay);
			if ( b == null ) { b=0;}
			this.allStudentBlockNames.set(bs[i].scheduleDisplay,b+1);				
		}
		for (var i=0; i < this.theStudentBlocksSource.length; i++ ) {
			var s = theStudents.get(parseInt(this.theStudentBlocksSource[i].student.localId));

			if ( s == null ) {
				DataIntegrity.addIssue("ERROR","MasterScheduleHandler","decorate","Can not find student in decorate of student schedule->" + this.theStudentBlocksSource[i].student.localId);
			} else {
				var blk = this.theMasterSchedule.get(this.theStudentBlocksSource[i].section.courseView);
				if ( blk == null ) {
					DataIntegrity.addIssue("ERROR","MasterScheduleHandler","decorate","Can not find courseview in decorate of student schedule->" + this.theStudentBlocksSource[i].section.courseView);
				} else {
					s.theSchedule.setBlocks(blk);				
				}
			}
		}
	} 

}
module.exports = MasterScheduleHandler;