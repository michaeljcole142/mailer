/*
 * A Room Handler represents a collection of the locations in the school.
 */
const Room = require('./room');
const DataLoader = require('./data_loader');

class RoomHandler {

	constructor() {
		this.theRooms=null;	
	}

	initialize() {
		this.theRooms = DataLoader.getRoomData();
	}

}
module.exports = RoomHandler;
