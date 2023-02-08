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
	static isADay() {
		if ( BlockCalculator.ABDay=="A") {
			return true;
		}
		return false;
	}
	static isBDay() { 
		if ( BlockCalculator.ABDay=="B") {
			return true;
		}
		return false;
	}
	static getCurrentTerm() {
		return "S2";
	}
	
	/*
	 * This is hard coded for now...
	 */
	static getBlockInfo(dateTime) {
		return BlockCalculator.ABDay + BlockCalculator.checkBlockStdDay(dateTime);
	}
	static checkBlockStdDay(passTime) {
		var h=passTime.getHours();
		var m=passTime.getMinutes();

		//standard times for blocks
		//HR: 7:35AM - 7:41AM
		//B1: 7:41AM - 9:01AM
		if ( h <= 7 && m < 35 ) {
			//pre block 1
			return 0;
		} else if ( h == 7 && m <= 59 || h == 8 && m <= 59 || h == 9 && m <= 1 ) {
			// block 1 or homeroom
			return 1;
		//B2: 9:09AM - 10:29AM
		} else if ( h == 9 && m <= 59 || h == 10 && m <= 29 ) {
			// block 2
			return 2;
		//UL: 10:29AM - 11:10AM			
		} else if ( h == 10 && m <= 59 || h == 11 && m <= 15 ) {
			// lunch
			return 2.5;
		//B3: 11:15AM - 12:35PM
		} else if ( h == 11 && m <= 59 || h == 12 && m <= 35 ) {
			// block 3
			return 3;
		//B4: 12:43PM - 2:03PM
		} else if ( h == 12 && m < 59 || h == 13 || h == 14 && m <= 3 ) {
			// block 4
			return 4;
		} else {
			// block 5 or after school
			return 5;
		}
	}
}
module.exports = BlockCalculator;