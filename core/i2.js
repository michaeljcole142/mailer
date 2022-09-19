const std = require('./test_data_reader');
const EmailHandler = require('./email_handler');

var students = std.getStudentData();
console.log("# of students is " + students.size);

for (var i = 0; i < students.size; i++)
  console.log(students.get(i));

var mailer = new EmailHandler();
console.log("sending and email")
mailer.sendTestEmail();
console.log("email has been sent")