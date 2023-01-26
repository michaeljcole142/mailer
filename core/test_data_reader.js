/*
 * The test data reader simulates a database or rest server reader
 * abstracting the user from file to json structure.
 * Notice all methods are static.  It is intended to be
 * somewhat of a singleton model.
 */
const fs   = require('fs');
const Student = require('./student');
const Faculty = require('./faculty');
const Course = require('./course');
const Block = require('./block');
const Pass = require('./pass');


class TestDataReader {	
	
	/* This method returns a Map of students.
	 * It is static so you can call without an instance of the
	 * class.  It returns a Map where the index is the student id and 
	 * the data is a student object.
	 */
	static getStudentData() {
		var studentsRaw = fs.readFileSync('./testdata/students.json');
		var theStudents = new Map();
		var students = JSON.parse(studentsRaw);
		for (var i=0; i < students.length; i++ ) {
			var s = new Student(parseInt(students[i].id), students[i].name, students[i].email);
			theStudents.set(s.id,s);
		}
//		console.log("loaded theStudents->" + JSON.stringify(Array.from(theStudents)));
		return theStudents;
	}
	static getFacultyData() {
		var facultyRaw = fs.readFileSync('./testdata/faculty.json');
		var theFaculty = new Map();
		var faculty = JSON.parse(facultyRaw);
		for (var i=0; i < faculty.length; i++ ) {
			var f = new Faculty(parseInt(faculty[i].id), faculty[i].name, faculty[i].email);
			theFaculty.set(f.id,f);
		}
		console.log("loaded theFaculty->" + JSON.stringify(Array.from(theFaculty)));
		return theFaculty;
	}
	static getCourseData() {
		var courseRaw = fs.readFileSync('./testdata/course.json');
		var theCourses = new Map();
		var course = JSON.parse(courseRaw);
		for (var i=0; i < course.length; i++ ) {
			var c = new Course(parseInt(course[i].id), course[i].name, course[i].department);
			theCourses.set(c.id,c);
		}
		console.log("loaded theCourses->" + JSON.stringify(Array.from(theCourses)));
		return theCourses;
	}
	static getBlockData() {
		var blockRaw = fs.readFileSync('./testdata/blocks.json');
		var theBlocks = new Map();
		var blocks = JSON.parse(blockRaw);
		for (var i=0; i < blocks.length; i++ ) {
			var b = new Block(parseInt(blocks[i].id), blocks[i].room, 
				blocks[i].blockNum,blocks[i].day,blocks[i].courseId,blocks[i].teacherId,blocks[i].students);
			theBlocks.set(b.id,b);
		}
		console.log("loaded theBlocks->" + JSON.stringify(Array.from(theBlocks)));
		return theBlocks;
	}
	static getPassData(forDate) {
		var passRaw = fs.readFileSync('./testdata/passes.json');
		var thePasses = new Map();
		var passes = JSON.parse(passRaw);
		for (var i=0; i < passes.length; i++ ) {
			var p = new Pass(parseInt(passes[i].id), passes[i].studentId, 
				passes[i].dateTime,passes[i].note);
			thePasses.set(p.id,p);
		}
		console.log("loaded thePasses->" + JSON.stringify(Array.from(thePasses)));
		return thePasses;
	}

}
module.exports = TestDataReader;