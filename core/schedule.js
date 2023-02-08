/*
 * A Schedule is used by both faculty and students.
 * It will contain the associated block data for each block
 * for a faculty member or a student.
 */
const DataIntegrity =  require('./data_integrity');
const BlockCalculator =  require('./block_calculator');

class Schedule {
	
	static scheduleDisplayMap=null;
	
	/* blocks should be constrained to 5 blocks. */
	constructor(aId) {
		this.id = aId;  // this is a backwards pointer to the
						// id of the teacher or student it is associated with.
		this.blockCount=0;  // this is a count of not null across 2 arrays. Updated in all setBlock Calls.
		this.ADayBlocks = [null,null,null,null];
		this.BDayBlocks = [null,null,null,null];
	}	
	
	setBlocks(block) {

		if ( block.term != "FY" && block.term != BlockCalculator.getCurrentTerm()) {
			return;
		}
		if ( Schedule.scheduleDisplayMap == null ) {
			Schedule.initializeScheduleDisplayMap();
		}
		var blksA=Schedule.scheduleDisplayMap.get(block.scheduleDisplay);
		if ( blksA == null ) {
			DataIntegrity.addIssue("ERROR","Schedule","setBlock","Can not find schedule display for->" + block.displaySchedule + " with->" +  JSON.stringify(this));
		} else {
			for ( var i=0; i < blksA.length; i++ ) {
				if ( blksA[i][0] == "A" ) {
					this.ADayBlocks[blksA[i][1]-1] = block;
				} else if ( blksA[i][0] == "B" ) {
					this.BDayBlocks[blksA[i][1]-1] = block;
				} else {
					DataIntegrity.addIssue("ERROR","Schedule","setBlock","Can not find Day schedule display for->" + block.displaySchedule + " with->" +  JSON.stringify(this));
				}
			}
		}
		this.blockCount=0;
		for ( var i=0; i < 4; i++ ) {
			if ( this.ADayBlocks[i] != null ) { this.blockCount++; }
			if ( this.BDayBlocks[i] != null ) { this.blockCount++; }
		}
	}
	getBlock(blockName) {
		if ( blockName == "A1" ) {
			return this.ADayBlocks[0];
		} else if ( blockName == "A2" ) {
			return this.ADayBlocks[1];
		} else if ( blockName == "A3" ) {
			return this.ADayBlocks[2];
		} else if ( blockName == "A4" ) {
			return this.ADayBlocks[3];
		} else if ( blockName == "B1" ) {
			return this.BDayBlocks[0];
		} else if ( blockName == "B2" ) {
			return this.BDayBlocks[1];
		} else if ( blockName == "B3" ) {
			return this.BDayBlocks[2];
		} else if ( blockName == "B4" ) {
			return this.BDayBlocks[3];
		}
		return null;
	}
	static initializeScheduleDisplayMap() {
		Schedule.scheduleDisplayMap=new Map();
		var sdm = Schedule.scheduleDisplayMap;
		sdm.set("1(A)", [["A",1]]);
		sdm.set("1(B)", [["B",1]]);
		sdm.set("2(A)", [["A",2]]);
		sdm.set("2(B)", [["B",2]]);
		sdm.set("3(A)", [["A",3]]);
		sdm.set("3(B)", [["B",3]]);
		sdm.set("4(A)", [["A",4]]);
		sdm.set("4(B)", [["B",4]]);
		sdm.set("1(A-B)",[["A",1],["B",1]]);
		sdm.set("2(A-B)",[["A",2],["B",2]]);
		sdm.set("3(A-B)",[["A",3],["B",3]]);
		sdm.set("4(A-B)",[["A",4],["B",4]]);
		sdm.set("1-2(B)",[["B",1],["B",2]]);
		sdm.set("1-2(A)",[["A",1],["A",2]]);
		sdm.set("3-4(B)",[["B",3],["B",4]]);
		sdm.set("3-4(A)",[["A",3],["A",4]]);	
		sdm.set("3-4(A-B)",[["B",3],["B",4],["A",3],["A",4]]);
		sdm.set("1-2(A-B)",[["B",1],["B",2],["A",1],["A",2]]);
		sdm.set("1-2,3-4(A-B)",[["B",1],["B",2],["B",3],["B",4],["A",1],["A",2],["A",3],["A",4]]);
		sdm.set("1-2,3-4(A)",[["A",1],["A",2],["A",3],["A",4]]);
	}
}
module.exports = Schedule;