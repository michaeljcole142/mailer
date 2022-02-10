/*
 * The Data Loader main engine that loads data. Its main decision is to 
 * broker between development/test and production.  It abstracts away the 
 * source of the data from the rest of the system. 
 */

const TestDataReader = require('./test_data_reader');
const ProdMode = require('./prod_mode');

class DataLoader {
	
	
	static getStudentData() {
		if ( ProdMode.isProductionModeTest() ) {
			return TestDataReader.getStudentData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static getFacultyData() {
		if ( ProdMode.isProductionModeTest() ) {
			return TestDataReader.getFacultyData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static getCourseData() {
		if ( ProdMode.isProductionModeTest() ) {
			return TestDataReader.getCourseData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static getBlockData() {
		if ( ProdMode.isProductionModeTest() ) {
			return TestDataReader.getBlockData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static getPassData() {
		if ( ProdMode.isProductionModeTest() ) {
			return TestDataReader.getPassData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
}
module.exports = DataLoader;