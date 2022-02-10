var nodemailer = require('nodemailer');
const Email = require('email-templates');

class EmailHandler {
	
	constructor() {		
	}

	async sendTestEmail() {
		var transporter = await nodemailer.createTransport({
			service: 'gmail.com',
			auth: {
				user: 'wrestlingvision.info@gmail.com',
				pass: 'myVision1'
			}
		});
	
		transporter.sendMail(
		{
			from: 'wrestlingvision.info@gmail.com',
			subject: 'test',
			to: 'michaeljcole142@gmail.com',
			html: "<div style='color:pink;'><b>Hello</b></div>"
		});
	}
	async sendUsingTemplate() {
		var thedata= { "email" : "michaeljcole142@gmail.com" , "name": "mike" , "title" : "hall pass" };
		var transporter = await nodemailer.createTransport({
			service: 'gmail.com',
			auth: {
				user: 'wrestlingvision.info@gmail.com',
				pass: 'myVision1'
			}
		});
		
		const email = new Email({
			message: {
				from: 'wrestlingvision.info@gmail.com',
				subject: 'Test Email from Template'
			},
			// uncomment below to send emails in development/test env:
			 send: true,
			transport: transporter	
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
console.log("running");
var mail = new EmailHandler();
mail.sendUsingTemplate();
