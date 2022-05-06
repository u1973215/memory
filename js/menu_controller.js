function start_game(){
	name = prompt("User name");
	if(name != "null") // Al apretar cancel, no fa res
	{
		var nameProcessed = name.replace(/\s/g, '') // Esborra els espais del nom en una variable temporal
		if(nameProcessed.length == 0) // Si el string resultant es buit, el nom no es valid
		{
			alert("Please enter a valid name")
		}
		else
		{
			sessionStorage.setItem("username", name);
	
			loadpage("./html/game.html");
		}
	}
}

function phaser_game()
{
	name = prompt("User name");
	if (name != "null") // Al apretar cancel, no fa res
	{
		var nameProcessed = name.replace(/\s/g, ''); // Esborra els espais del nom en una variable temporal
		while (nameProcessed.length == 0) // Si el string resultant es buit, el nom no es valid
		{
			alert("Please enter a valid name")
			name = prompt("User name");
			if (name == "null") return;
			nameProcessed = name.replace(/\s/g, '');
		}
		sessionStorage.setItem("username", name);

		loadpage("./html/phasergame.html");
	}
}

function ranking()
{

}

function options()
{
	loadpage("./html/options.html");
}

function load()
{
	loadpage("./html/load.html");
}

function exit ()
{
	var nameProcessed = name.replace(/\s/g, '') // Esborra els espais del nom en una variable temporal
	if (nameProcessed != "" && nameProcessed != "null")
	{
		alert("Leaving " + name + "'s game");
	}
	name = "";
}

