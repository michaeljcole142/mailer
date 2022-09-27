/*
 * The Controller class is main controller of clientside.
 */
 
class Controller {
	constructor() {
	}
	static isProcessing=false;
	async initializeData() {
		var abDay = document.getElementById("block-day").value;
		var dateFor = document.getElementById("for-date").value;
		if ( abDay.length > 0 && dateFor.length > 0 ) {
			alert("processing for A/B Day->" + abDay + " and Date->" + dateFor);
		} else {
			alert("Invalid A/B Day->" + abDay  + " or Date->" + dateFor + " Stopping initialize");
			return;
		}
	
		if ( Controller.isProcessing ) { 
			alert("already processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("in initializeData");
		var x = new DataLoader();
		var vb = new ViewBuilder();
		vb.setProcessingLoadOn();
		var ret = await x.initializeData(abDay,dateFor)
		vb.buildDataIntegrityTable(ret);
		vb.buildDataIntegrityCounts(ret);
		vb.setProcessingLoadOff();
		Controller.isProcessing = false;
		var ss = await x.getStudentData();
		vb.buildStudentDataView(ss);
		var xx = await x.getStudentBlockNames();
		vb.buildBlockTypeCountTab(xx);
		var pp = await x.getPasses();
		vb.buildPassesTab(pp);
		var dp = await x.getDecoratedPasses();
		vb.buildDecoratePassesTab(dp);
	}
}