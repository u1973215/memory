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
				this.username = sessionStorage.getItem("username","unknown");
			}
			//sessionStorage.clear();
		}
	});
	return {};
}();






