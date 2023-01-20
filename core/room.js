/*
 * A Room represents a location in the school.
 */
class Room {
	constructor(aNum,aDept,aType,aBldg,aComment,aLoc,aCap) {
		this.num = aNum;
		this.dept = aDept;
		this.type = aType;
		this.bldg = aBldg;
		this.comment = aComment;
		this.loc = aLoc;
		this.cap = aCap;
	}
}
module.exports = Room;