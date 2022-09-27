/*
 * The DataLoader is a client side communication to the
 * server for data.
 */
 
class DataLoader {
	
	constructor() {
	}
	
	async initializeData(abDay,forDate) {	
		const rr = async()=> { 
			var data={ "abDay":abDay, "forDate" : forDate };
			const response = await fetch('/initialize_data', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getStudentData() {	
		const rr = async()=> { 
			const response = await fetch('/get_student_data', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getStudentBlockNames() {
		const rr = async()=> { 
			const response = await fetch('/get_student_block_names', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getPasses() {
		const rr = async()=> { 
			const response = await fetch('/get_passes', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
	async getDecoratedPasses() {
		const rr = async()=> { 
			const response = await fetch('/get_decorated_passes', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'}
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				return json;
			} else {
				const json=await response.json();
				return json;
			}
		}
		var ret= await rr();
		return ret;
	}
}