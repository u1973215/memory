var load_obj = function(){
	var vue_instance = new Vue({
		el: "#saves_id",
		data: {
			saves: []
		},
		created: function(){
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			this.saves = arrayPartides;
		},
		methods: { 
			load: function(i)
			{
				sessionStorage.idPartida = i;
				loadpage("../html/phasergame.html");
			},

			delAll: function()
			{
				var confirm = prompt('Are you sure you want to DELETE ALL SAVE FILES?\nType "CONFIRM" to proceed.');
				if(confirm == "CONFIRM") // Al apretar cancel o fallar, no fa res
				{
					localStorage.removeItem("partides");
					location.reload();
				}
			}
		}
	});
	return {}; 
}();

