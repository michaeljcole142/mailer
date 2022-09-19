/*
 * The Data Loader main engine that loads data. Its main decision is to 
 * broker between development/test and production.  It abstracts away the 
 * source of the data from the rest of the system. 
 */

const TestDataReader = require('./test_data_reader');
const ProdDataReader = require('./prod_data_reader');
const ProdMode = require('./prod_mode');

class DataLoader {
	
	static async getStudentData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getStudentData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getStudentData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getFacultyData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getFacultyData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getFacultyData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getCourseData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getCourseData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getCourseData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getMasterScheduleData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getMasterScheduleData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getMasterScheduleData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getPassData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getPassData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getPassData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
	static async getStudentBlockData() {
		if ( ProdMode.isProductionModeTest() ) {
			return await TestDataReader.getStudentBlockData();
		} else if ( ProdMode.isProductionModeProd() ) {
			return await ProdDataReader.getStudentBlockData();
		} else {
			throw Error("Unknown Production Mode!!!");
		}
	}
}
module.exports = DataLoader;