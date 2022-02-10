/*
 * A Schedule is used by both faculty and students.
 * It will contain the associated block data for each block
 * for a faculty member or a student.
 */
const DataIntegrity =  require('./data_integrity');
 
class Schedule {
	
	/* blocks should be constrained to 5 blocks. */
	constructor(aId) {
		this.id = aId;  // this is a backwards pointer to the
						// id of the teacher or student it is associated with.
		this.ADayBlocks = [null,null,null,null];
		this.BDayBlocks = [null,null,null,null];
	}	
	
	addBlock(block) {
		if ( block.day == "A" && block.blockNum == 1 ) {
			if ( this.ADayBlocks[0] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for A Day block 1");
			} else {
				this.ADayBlocks[0] = block;
			}		
		} else if ( block.day == "A" && block.blockNum == 2 ) {
			if ( this.ADayBlocks[1] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for A Day block 2");
			} else {
				this.ADayBlocks[1] = block;
			}		
		} else if ( block.day == "A" && block.blockNum == 3 ) {
			if ( this.ADayBlocks[2] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for A Day block 3");
			} else {
				this.ADayBlocks[2] = block;
			}		
		} else if ( block.day == "A" && block.blockNum == 4 ) {
			if ( this.ADayBlocks[3] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for A Day block 4");
			} else {
				this.ADayBlocks[3] = block;
			}		
		} else if ( block.day == "B" && block.blockNum == 1 ) {
			if ( this.BDayBlocks[0] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for B Day block 1");
			} else {
				this.BDayBlocks[0] = block;
			}		
		} else if ( block.day == "B" && block.blockNum == 2 ) {
			if ( this.BDayBlocks[1] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for B Day block 2");
			} else {
				this.BDayBlocks[1] = block;
			}		
		} else if ( block.day == "B" && block.blockNum == 3 ) {
			if ( this.BDayBlocks[2] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for B Day block 3");
			} else {
				this.BDayBlocks[2] = block;
			}		
		} else if ( block.day == "B" && block.blockNum == 4 ) {
				if ( this.BDayBlocks[3] != null ) {
				DataIntegrity("INFO","Replacing existing block for->" + this.id + " for B Day block 4");
			} else {
				this.BDayBlocks[3] = block;
			}				
		} else {
			DataIntegrity.addIssue("ERROR","Adding Schedule item with bad block->" + block.blockNum + " or day->" + block.day + " for block->" + block.id);
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
}
module.exports = Schedule;