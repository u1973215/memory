function start_game(){
	name = prompt("User name");
	if(name != "null") //Al apretar cancel, no fa res
	{
		sessionStorage.setItem("username", name);
	
		loadpage("./html/game.html");
	}
}

function phaser_game(){
	loadpage("./html/phasergame.html");
}

function exit (){
	if (name != ""){
		alert("Leaving " + name + "'s game");
	}
	name = "";
}

function options(){
	loadpage("./html/options.html");
}

function load(){
	loadpage("./html/load.html");
}

