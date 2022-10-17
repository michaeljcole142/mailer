var nodemailer = require('nodemailer');
const Email = require('email-templates');
/*
 * This class is used to send an email. 
 * There are methods for each type of email that you
 * would like to send.
 */

class EmailHandler {
	static mailerp = "aclhcywdjpnczngn"; //"fastpass2022" 	
	constructor() {	
		this.user = 'HCPasses@hcrhs.org';  //need initialization mechanism later.
		this.pwd = EmailHandler.mailerp;
		if ( this.user == null ) {
			this.user = 'wrestlingvision.info@gmail.com';
		}
		this.transporter = null;
		this.prodTransporter=null;
	}
	async initialize() {

		this.prodTransporter = await nodemailer.createTransport({
			service: 'gmail.com',
			auth: {
				user: this.user,
				pass: this.pwd
			}
		});
		
		const anothertransporter = await nodemailer.createTransport({
			host: 'smtp.ethereal.email',	
			port: 587,
			auth: {
				user: 'tom.cole58@ethereal.email',
				pass: 'Ag81kG1HmkfaQBrXeR'
			}
		});
		this.transporter = anothertransporter;
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
		
		email.send({
			template: 'student_pass',
			message: {
				to: thePass.student.email
			},
				locals: {
					name: thePass.student.name,
					datetime: thePass.dateTime,
					from: thePass.fromBlock.room,
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
		
		email.send({
			template: 'homeroom_teacher',
			message: {
				to: teacher.email
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
}
module.exports = EmailHandler;
