var nodemailer = require('nodemailer');
const Email = require('email-templates');
/*
 * This class is used to send an email. 
 * There are methods for each type of email that you
 * would like to send.
 */

class EmailHandler {
	
	constructor() {	
		this.user = null;  //need initialization mechanism later.
		this.pwd = null;
		if ( this.user == null ) {
			this.user = 'wrestlingvision.info@gmail.com';
			this.pwd = 'myVision1';
		}
		this.transporter = null;
	}
	async initialize() {
		/*
		this.transporter = await nodemailer.createTransport({
			service: 'gmail.com',
			auth: {
				user: this.user,
				pass: this.pwd
			}
		});
		*/
		const anothertransporter = await nodemailer.createTransport({
			host: 'smtp.ethereal.email',	
			port: 587,
			auth: {
				user: 'joe.crist92@ethereal.email',
				pass: 'thC9m9162qfWzTb9vF'
			}
		});
		this.transporter = anothertransporter;
	}
	async sendPassToStudent(thePass) {
		if ( this.transporter == null ) {
			await this.initialize();
		}
		var sender = { "name" : "PassFactory@HCRHS", "address" : this.user };

		const email = new Email({
			message: {
				from: sender,
				subject: 'Student Pass Info'
			},
			send: true,
			transport: this.transporter	
		});
		
		email.send({
			template: 'student_pass',
			message: {
				to: 'michaeljcole142@gmail.com'
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
	async sendTestEmail() {
		if ( this.transporter == null ) {
			await this.initialize();
		}
	
		this.transporter.sendMail(
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
			 send: true,
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
