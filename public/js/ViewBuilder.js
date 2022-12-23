/*
 * The ViewBuilder screen builder.
 */
 
class ViewBuilder {
	
	constructor() {
	}
	
	
	async setProcessingLoadOn() { 
		$('#integrity-tab-body').empty();
		$('#integrity-tab-totals').empty();
		document.getElementById("integrity-processing").classList.remove("d-none");
		$('#student-tab-body').empty();
		$('#block-type-tab-body').empty();
		$('#passes-tab-body').empty();
		$('#db-tab-body').empty();
	}

	async setProcessingLoadOff() { 
		document.getElementById("integrity-processing").classList.add("d-none");
	}
	async buildDataIntegrityTable(integrityIssues) {	
		$('#integrity-tab-body').empty();
		var tab = document.getElementById("integrity-tab-body");
		for (var i=0; i < integrityIssues.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=integrityIssues[i].level;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=integrityIssues[i].objectType;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=integrityIssues[i].method;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=integrityIssues[i].description;
			tr.appendChild(td);
		}
	}
	buildStudentDataView(studentData) {
		$('#student-tab-body').empty();
		var tab = document.getElementById("student-tab-body");
		for (var i=0; i < studentData.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=studentData[i].id;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=studentData[i].name;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=studentData[i].email;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=studentData[i].theSchedule.blockCount;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=JSON.stringify(studentData[i].theSchedule);;
			tr.appendChild(td);
		}
	}
	buildPassesTab(passesData) {
		$('#passes-tab-body').empty();
		var tab = document.getElementById("passes-tab-body");
		for (var i=0; i < passesData.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=passesData[i].id;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=passesData[i].studentId;
			tr.appendChild(td);
			var s="N";
			if ( passesData[i].student != null ) { s="Y";}
			td = document.createElement("td");
			td.innerHTML=s;
			tr.appendChild(td);
			var fb="N";
			if ( passesData[i].fromBlock != null ) { fb="Y";}
			td = document.createElement("td");
			td.innerHTML=fb;
			tr.appendChild(td);
			td = document.createElement("td");
			var dt = new Date(passesData[i].dateTime);
			td.innerHTML=dt.toLocaleString();
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=passesData[i].note;
			tr.appendChild(td);
		}
	}
	buildDecoratePassesTab(passesData) {
		$('#db-tab-body').empty();
		var tab = document.getElementById("dp-tab-body");
		for (var i=0; i < passesData.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=passesData[i].student.id;
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].student.name;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=passesData[i].student.email;
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].homeRoomNumber;
			tr.appendChild(td);
			
			td = document.createElement("td");
			if ( passesData[i].homeRoomTeacher != null ) {
				td.innerHTML=passesData[i].homeRoomTeacher.name;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			td = document.createElement("td");
					if ( passesData[i].homeRoomTeacher != null ) {
				td.innerHTML=passesData[i].homeRoomTeacher.email;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].fromRoomNumber;
			tr.appendChild(td);
			td = document.createElement("td");
			if ( passesData[i].fromRoomTeacher != null ) {
				td.innerHTML=passesData[i].fromRoomTeacher.name;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");
					if ( passesData[i].fromRoomTeacher != null ) {
				td.innerHTML=passesData[i].fromRoomTeacher.email;
			} else {
				td.innerHTML="";
			}
			tr.appendChild(td);
			
			td = document.createElement("td");		
			var dt = new Date(passesData[i].dateTime);
			td.innerHTML=dt.toLocaleString();
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.innerHTML=passesData[i].note;
			tr.appendChild(td);
		}
	}
	buildBlockTypeCountTab(blockTypeCounts) {
		$('#block-type-tab-body').empty();
		var tab = document.getElementById("block-type-tab-body");
		for (var i=0; i < blockTypeCounts.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=blockTypeCounts[i][0];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=blockTypeCounts[i][1];
			tr.appendChild(td);
		}
	}
	buildDataIntegrityCounts(integrityIssues) {
		var oCount = new Map();
		for ( var i=0; i < integrityIssues.length; i++ ) {
			var at = oCount.get(integrityIssues[i].objectType);
			if ( at == null ) {
				var mCount= new Map();
				mCount.set(integrityIssues[i].method,1);
				oCount.set(integrityIssues[i].objectType,mCount);
			} else {
				var mCount = at.get(integrityIssues[i].method);
				if ( mCount == null ) {
					at.set(integrityIssues[i].method,1);
				} else {
					at.set(integrityIssues[i].method, mCount+1);
				}
			}
		}
		var vv = Array.from(oCount.keys());
		var vv2 = Array.from(oCount.values());
		console.log("vv->" + vv + " ->" + vv2);
		var vv3=[];
		for ( var i=0; i < vv.length; i++ ) {
			var mMapA=Array.from(vv2[i]);
			for (var ii=0; ii< mMapA.length; ii++ ) {	
				vv3.push([vv[i],mMapA[ii][0], mMapA[ii][1]]);
			}
		}
		$('#integrity-tab-totals').empty();
		var tab = document.getElementById("integrity-tab-totals");
		for (var i=0; i < vv3.length; i++ ) {
			var tr = document.createElement("tr");
			tab.appendChild(tr);
			var td = document.createElement("td");
			td.innerHTML=vv3[i][0];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=vv3[i][1];
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML=vv3[i][2];
			tr.appendChild(td);
		}
	}
		
}