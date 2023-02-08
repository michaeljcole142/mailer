const Student = require('./student');
const Faculty = require('./faculty');
const Course = require('./course');
const Room = require('./room');

const Schedule = require('./schedule');
const MasterSchedule = require('./master_schedule');
const Pass = require('./pass');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const url = "https://nj-hcrhs.myfollett.com/query/rest/api/";

class ProdDataReader 
{
	static key = null;
	static tempFacultyId = 9000000;
	static getKey = async () => 
	{
		/* commenting out because running multiple days problem.
		if (this.key != null)
			return this.key;
		*/
		const url = 'https://nj-hcrhs.myfollett.com/oauth/rest/v2.0/auth'
		const data = {
			client_id: 'dailyAbsences',
			client_secret: 'whosOnFirst22!'
		};
		var config = {headers: {'Content-Type': 'application/x-www-form-urlencoded' }};  
		const request = await axios.post(url, qs.stringify(data), config);
		this.key = request.data.access_token;  
		return this.key;
	} //End getKey

  
	static async getData(url){
console.log("urlll->" + url);
		var secretKey = await ProdDataReader.getKey();
		var options = { headers:{ Authorization: ' Bearer ' + secretKey }};
		try {
			const res = await axios.get(url, options);
//console.log("res->" + JSON.stringify(res));
			const d = await res.data;
//console.log("d->" + JSON.stringify(d));
			return d;
		} catch (e) {
			console.log("e.message->" + e.message);
			console.log("ez->" + e.stack);
		}
		return null;
	} //end getData

  
	static async getPassData(forDate)
	{
		var d = forDate;
		var thePasses = new Map();
		var thePasses = new Map();
		console.log("Date is " + d);
		var p =  await ProdDataReader.getData(url + "passes?type=Passes&date=" + d);
		for (var i=0; i < p.length; i++ ) 
		{
			var dt = new Date(d + " " + p[i].fieldA002);
			var pass = new Pass(i+1,parseInt(p[i].student.localId),dt, p[i].comment);
			thePasses.set(i+1, pass);
		}
		return thePasses;
	}	


	static async getStudentData() 
	{
		var theStudents = new Map();
		var std =  await ProdDataReader.getData(url + "students2?status=Active");

		for (var i=0; i < std.length; i++ ) 
		{
			//1's are OUT.
			if (std[i].fieldB017 != "1")
			{
				var s=new Student(parseInt(std[i].localId), std[i].nameView, std[i].person.firstName, std[i].person.lastName, std[i].person.email01,std[i]);
				theStudents.set(s.id,s);
			} 
		}
		return theStudents;
	}
	
	static async getStudentBlockData()
	{
		var prevId = "";
		var stdSched = new Map();
		var stdCourses = new Array();

		var d = new Date();
		var month = d.getMonth() + 1;
		var year = d.getFullYear()
		if (month > 6)
		year = year + 1;

		var ss =  await ProdDataReader.getData(url + "stdSched2?year=" + year);
/*
		for (var i=0; i < ss.length; i++ )
			{
			var std = stdSched.get(ss[i].student.localId);
			if (std == null)
			{
				stdCourses = new Array();
				stdCourses.push(ss[i].section.courseView);
				stdSched.set(ss[i].student.localId, stdCourses)
			}
			else
			{
				std.push(ss[i].section.courseView);
			}
		}
 */            
		return ss;
	}
  
	static async getFacultyData()
	{
		var theFaculty = new Map();
		var f =  await ProdDataReader.getData(url + "staff?status=Active");
		for (var i=0; i < f.length; i++ )
		{  
			var fac = new Faculty(parseInt(f[i].stateId), f[i].nameView, f[i].person.firstName, f[i].person.lastName, f[i].person.email01, f[i].departmentCode);
			theFaculty.set(fac.id,fac);
		} 
		return theFaculty;
	}
  
	static async getCourseData() 
	{
		var theCourses = new Map();
		var d = new Date();
		var month = d.getMonth() + 1;
		var year = d.getFullYear() 
		if (month > 6) {
			year = year + 1;
		}
		var c =  await ProdDataReader.getData(url + "course?year=" + year);
		
		for (var i=0; i < c.length; i++ ) 
		{
			var crs = new Course(parseInt(c[i].number), c[i].description, c[i].departmentCode,c[i]);
			theCourses.set(crs.id, crs);
		}
		return theCourses;
	}

  
	static async getMasterScheduleData() 
	{
		var d = new Date();
		var month = d.getMonth() + 1;
		//var year = d.getYear() + 1900;
		var year = d.getFullYear() 
		if (month > 6)
			year = year + 1;
		var s =  await ProdDataReader.getData(url + "schedMaster?year=" + year);
		var theSched = new Map();
		for (var i=0; i < s.length; i++ ) {

if ( s[i].courseView == "129-06" ){
console.log("MS->" + JSON.stringify(s[i]));
	console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
}
			var b=new MasterSchedule(s[i].courseView,s[i].primaryRoom.roomNumber, s[i].description, s[i].scheduleDisplay, s[i].termView, s[i].primaryStaff.person.email01,s[i]);
			if ( theSched.has(s[i].courseView) ) {
				//console.log("DUPLICATE COURSE->" + JSON.stringify(s[i]) + "<- and ->" + JSON.stringify(theSched.get(s[i].courseView)));
			} else {
if ( s[i].courseView == "554-11" ) {
	console.log("setting theSched->" + JSON.stringify(b));
}
				theSched.set(s[i].courseView, b);
			}
		}
		return theSched;
	}


	static jsonToFile(fName, data)
	{
		fs.writeFile(fName, JSON.stringify(data), 
         function (err) {
             if (err) return console.log(err);
		});
  
	}  

	static async getDayBellSched(d) 
	{
		var db =  await ProdDataReader.getData(url + "daybell?date=" + d);
	}
	static async getABDay(d)
	{
		var day="";
		console.log("date is " + d);
		var db =  await ProdDataReader.getData(url + "dateToAB?date=" + d);
		console.log("db is " + JSON.stringify(db));

		console.log("schedule day number is " + db[0].scheduleDayNumber);
		switch (db[0].scheduleDayNumber)
		{
			case 1:
				day = "A";
				break;
			case 2:
				day = "B";
				break;
		}
		return(day);
	}
	static async getRoomData()
	{
		var theRooms = new Map();
		var rm =  await ProdDataReader.getData(url + "rooms");
		for (var i=0; i < rm.length; i++ )
		{
			var r=new Room(rm[i].roomNumber, rm[i].departmentCode, rm[i].roomTypeCode, rm[i].buildingCode, rm[i].fieldC001, rm[i].locationCode, rm[i].maxCapacity);
			theRooms.set(rm[i].roomNumber,r);  
		}
		return theRooms;
	}
	
} //end class ProdDataReader

module.exports = ProdDataReader;
