/*
 * This is a utility class that calculates for a given
 * datatime the block that the students are in at that time.
 *
 * This is initially stub'd out so it will need work that takes into
 * consideration A/B day and type of school day that it is -
 * normal, delay, 1/2 day, etc.
 */


class BlockCalculator {	
	
	static ABDay;
	
	static setABDay(abIn){
		if ( abIn != "A" && abIn != "B" ) {
			BlockCalculator.ABDay = abIn;
			console.log("ERROR: Bad ABDay Initialized->" + abIn);
		} else {
			BlockCalculator.ABDay = abIn;
		}
	}
	static getCurrentTerm() {
		return "S1";
	}
	
	/*
	 * This is hard coded for now...
	 */
	static getBlockInfo(dateTime) {
		return BlockCalculator.ABDay + "1";
	}
}
module.exports = BlockCalculator;