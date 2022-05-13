var gameObj = function (){
	let l_partida = null;
	if (sessionStorage.idPartida && localStorage.partides){
		let arrayPartides = JSON.parse(localStorage.partides);
		if (sessionStorage.idPartida < arrayPartides.length)
			l_partida = arrayPartides[sessionStorage.idPartida];
	}
	var vueInstance = new Vue({
		el: "#game_id",
		data: {
			username:'',
		},
		created: function(){
			if (l_partida){
				this.username = l_partida.username;
			}
			else{
				/*
				var json = localStorage.getItem("config") || '{"cards": 3,"dificulty": "hard"}';
				options_data = JSON.parse(json);
				this.num_cards = options_data.cards;

				switch (options_data.dificulty)
				{
					case "easy":
						this.dif_mult = 10;
						break;

					case "normal":
						this.dif_mult = 20;
						break;

					case "hard":
						this.dif_mult = 40;
						break;
				}
				console.log(this.dif_mult);
				*/

				this.username = sessionStorage.getItem("username","unknown");
			}
			//sessionStorage.clear();
		}
	});
	return {};
}();






