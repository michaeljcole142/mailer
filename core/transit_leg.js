/*
 * A TransitLeg represents a leg of a student moving
 * from place A to place B and back on campus.
 */


class TransitLeg {
	
	constructor(studentId,fromLocation,fromTime,toLocation,arrivalTime) {
		this.studentId = studentId;
		this.fromLocation = fromLocation;
		this.fromTime = fromTime;
		this.toLocation=toLocation;
		this.arrivalTime = arrivalTime;
	}	
	setArrivalTime() {
		this.arrivalTime=new Date();
	}
	
}
module.exports = TransitLeg;