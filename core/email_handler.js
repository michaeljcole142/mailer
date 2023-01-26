var nodemailer = require('nodemailer');
const Email = require('email-templates');
/*
 * This class is used to send an email. 
 * There are methods for each type of email that you
 * would like to send.
 */

class EmailHandler {
	static mailerp = "aclhcywdjpnczngn"; //"fastpass2022" 	
//	static mailerp = "ydpgrcfceixcpvxa";
	constructor() {	
		this.user = 'HCPasses@hcrhs.org';  //need initialization mechanism later.
//		this.user = 'michaeljcole142@gmail.com'; 
		this.productionAdmins="michael.cole@hcrhs.org,michaeljcole142@gmail.com";
		this.pwd = EmailHandler.mailerp;
		if ( this.user == null ) {
			this.user = 'wrestlingvision.info@gmail.com';
		}
		this.transporter = null;
		this.prodTransporter=null;
	}
	async initialize() {

		this.prodTransporter = await nodemailer.createTransport({
			pool : true,
			maxConnections: 10,
			service: 'gmail.com',
			auth: {
				user: this.user,
				pass: this.pwd
			}
		});
		
		const anothertransporter = await nodemailer.createTransport({
			pool : true,
			maxConnections: 10,
			host: 'smtp.ethereal.email',	
			port: 587,
			auth: {
				user: 'jon.windler@ethereal.email',
				pass: 'DfCHXeFTm3yHBSE2YR'
			}
		});
		this.transporter = this.prodTransporter;
//		this.transporter = this.anotherTransporter;

	}
	closeIt() {
		this.transporter.close();
	}
	async sendPassToStudent(thePass) {
		if ( this.transporter == null ) {
			await this.initialize();
		}
		// THis is a HACK remove later.
		if ( thePass.student == null || thePass.student.name == null ) {
			console.log("ERROR: WHAT IS UP WITH NO STUDENT");
			return;
		}
		var sender = { "name" : "PassFactory@HCRHS", "address" : this.user };

		const email = new Email({
			message: {
				from: sender,
				subject: 'Student Pass Info'
			},
			send: true,
			preview: false,
			transport: this.transporter	
		});
		
		//HACK REMOVE
		var toEmail = thePass.student.email;
//		var toEmail = "michaeljcole142@gmail.com";
		var dt = thePass.dateTime;
		var rm = "";
		if ( thePass.fromBlock != null && thePass.fromBlock.room != null ) {
			rm = thePass.fromBlock.room;
		}
		var dtS = dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + " " + dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
		email.send({
			template: 'student_pass',
			message: {
				to: toEmail
			},
				locals: {
					name: thePass.student.name,
					fname: thePass.student.fName,
					datetime: dtS,
					from: rm,
					note: thePass.note
				}
		})
		.catch(console.error);		
	}
	async sendHRTeacher(teacher, passList) {
		if ( this.transporter == null ) {
			await this.initialize();
		}
		
		var sender = { "name" : "PassFactory@HCRHS", "address" : this.user };

		const email = new Email({
			message: {
				from: sender,
				subject: 'Student Pass List'
			},
			send: true,
			preview: false,
			transport: this.transporter	
		});

		var toEmail=teacher.email;
//		var toEmail = "michaeljcole142@gmail.com";
		
		email.send({
			template: 'homeroom_teacher',
			message: {
				to: toEmail
			},
				locals: {
					students: passList,
					name: teacher.name
				}
		})
		.catch(console.error);		
	}
	async sendTestEmail() {
		if ( this.prodTransporter == null ) {
			await this.initialize();
		}
	
		this.prodTransporter.sendMail(
		{
			from: this.user,
			subject: 'test',
			to: 'michaeljcole142@gmail.com',
			html: "<div style='color:pink;'><b>Hello</b></div>"
		});
	}
	async sendProdStatusEmail(subject,message) {
		if ( this.prodTransporter == null ) {
			await this.initialize();
		}
		var sender = { "name" : "PassFactory@HCRHS", "address" : this.user };
	
		this.prodTransporter.sendMail(
		{
			from: sender,
			subject: subject,
			to: this.productionAdmins,
			html: message
		});
	}
	async sendTestUsingTemplate() {
		var thedata= { "email" : "michaeljcole142@gmail.com" , "name": "mike" , "title" : "hall pass" };
		if ( this.transporter == null ) {
			await this.initialize();
		}
		
		const email = new Email({
			message: {
				from: this.user,
				subject: 'Test Email from Template'
			},
			// uncomment below to send emails in development/test env:
			 send: false,
			 preview: false,
			transport: this.transporter	
		});

		email.send({
			template: 'test',
			message: {
				to: thedata.email
			},
				locals: {
					name: thedata.name,
					title: thedata.title
				}
		})
		.catch(console.error);		
	}
	async sendTeacherEmail(teacher, passList) {

		var students=[];
		for ( var i=0; i < passList.blockLeaveList.length; i++ ) {
			var rec={};
			rec.dtS = passList.blockLeaveList[i].dateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
			rec.dateTime = passList.blockLeaveList[i].dateTime;
			rec.name = passList.blockLeaveList[i].student.name;
			rec.block = passList.blockLeaveList[i].fromBlock.scheduleDisplay;
			rec.note = passList.blockLeaveList[i].note;
			students.push(rec);
		}
		students.sort(function(a,b) { return a.dateTime - b.dateTime; });

		if ( this.transporter == null ) {
			await this.initialize();
		}
		
		var sender = { "name" : "PassFactory@HCRHS", "address" : this.user };

		const email = new Email({
			message: {
				from: sender,
				subject: 'Student Pass List'
			},
			send: true,
			preview: false,
			transport: this.transporter	
		});

		var toEmail=teacher.email;
		if ( toEmail == null ) {
			console.log("ERRRRRRR no to email->" + JSON.stringify(teacher));
			return;
		}
//		var toEmail = "michaeljcole142@gmail.com";
		try {
		email.send({
			template: 'teachers',
			message: {
				to: toEmail
			},
				locals: {
					students: passList.homeRoomList,
					passes: students,
					name: teacher.fName
				}
		});
		} catch(err) {
			console.error;
			console.log("e->" + err.stack);
		}
	}
	
}
module.exports = EmailHandler;
