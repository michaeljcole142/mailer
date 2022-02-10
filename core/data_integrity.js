/*
 * A DataIntegrity is a problem with processing and loading data. 
 * We are not using exception/error because they will stop processing.
 * We want to load all data and evaluate all integrity problems.
 */
 
class DataIntegrity {
	
	/*
	 * basic class with an array of level and description. 
	 * It will become more formal as we learn more. mcole - 2/8/2020
	 */
	static issues=[];
	
	static print() {
		if ( DataIntegrity.issues.length > 0 ) {
			for (var i=0; i < DataIntegrity.issues.length; i++ ) {
				console.log( DataIntegrity.issues[i].level + " : " + DataIntegrity.issues[i].description);
			}
		} else {
			console.log("no integrity errors");
		}
	}
	static addIssue(l,d) {
		DataIntegrity.issues.push({level:l,description: d});
	}
	
}
module.exports = DataIntegrity;