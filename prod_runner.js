var fetch = require('node-fetch');  

function sendit() {	
		const rr = async()=> { 
			var data={ "flag": "ERRO" };
			const response = await fetch('http://localhost:8002/run_prod_batch', {
				method : 'POST' ,
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			});
			if ( response.status !== 200 ) {
				const json = await response.json();
				console.log("res->" + JSON.stringify(json));
				return json;
			} else {
				const json=await response.json();
				console.log("res->" + JSON.stringify(json));
				return json;
			}
		}
		rr();
}
	
sendit();
console.log("pastit");