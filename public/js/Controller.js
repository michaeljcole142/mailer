/*
 * The Controller class is main controller of clientside.
 */
 
class Controller {
	constructor() {
	}
	static isProcessing=false;
	async initializeData() {
		var dateFor = document.getElementById("for-date").value;
		if ( dateFor.length > 0 ) {
			alert("processing for Date->" + dateFor);
		} else {
			alert("Invalid Date->" + dateFor + " Stopping initialize");
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
		var ret = await x.initializeData(dateFor);
		
		
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
	async emailPasses() {
		var dateFor = document.getElementById("for-date").value;
	
		if ( Controller.isProcessing ) { 
			alert("controller is processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("emailing!");
		var x = new DataLoader();
		var ret = await x.emailPasses();
		console.log("ret->" + JSON.stringify(ret));
	}
	async emailTestPasses() {
		var dateFor = document.getElementById("for-date").value;
	
		if ( Controller.isProcessing ) { 
			alert("controller is processing.  Please wait...");
			return;
		}
		Controller.isProcessing = true;
		console.log("emailing!");
		var x = new DataLoader();
		var ret = await x.emailTestPasses();
		console.log("ret->" + JSON.stringify(ret));
	}
}
module.exports = Controller;