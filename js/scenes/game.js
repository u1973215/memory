
class GameScene extends Phaser.Scene
{
    constructor ()
	{
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;

		this.username ='';
		this.current_card = [];
		this.items = [];
		this.num_cards = 1;
		this.bad_clicks = 0;

		this.local_save = function()
		{
			let partida = {
				username: this.username,
				current_card: this.current_card,
				items: this.items,
				num_cards: this.num_cards,
				bad_clicks: this.bad_clicks
			}
			alert(this.username);
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			arrayPartides.push(partida);
			localStorage.partides = JSON.stringify(arrayPartides);
			alert("NO");
			loadpage("../index.html");
		}
    }

    preload ()
	{	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create ()
	{
		var saveButton = document.getElementById("save-button");
		saveButton.addEventListener("click", () => this.local_save());

		let l_partida = null;

		if (sessionStorage.idPartida && localStorage.partides)
		{
			console.log("exiteix la partida");
			let arrayPartides = JSON.parse(localStorage.partides);
			if (sessionStorage.idPartida < arrayPartides.length)
				l_partida = arrayPartides[sessionStorage.idPartida];
		}
		
		if (l_partida){
			this.username = l_partida.username;
			this.current_card = l_partida.current_card;
			this.items = l_partida.items;
			this.num_cards = l_partida.num_cards;
			this.bad_clicks = l_partida.bad_clicks;
			console.log("partida found");
		}
		else{
			////////////////////////////////////////
			var json = localStorage.getItem("config") || '{"cards": 3,"dificulty": "hard"}';
			var options_data = JSON.parse(json);
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
			////////////////////////////////////////

			this.username = sessionStorage.getItem("username","unknown");
			console.log(this.username);
		}
		sessionStorage.clear();


		var arraycards = ['cb', 'co', 'sb', 'so', 'tb', 'to']; // inicialment, arraycards conte totes les possibles cartes
		this.cameras.main.setBackgroundColor(0xF2F2CE);
		
		this.cards = this.physics.add.staticGroup();

		var totalCards = this.num_cards * 2;

		// do magic here
		var fils = Math.round(Math.sqrt(totalCards));
		var cols = Math.ceil(Math.sqrt(totalCards));

		console.log(totalCards);
		console.log(fils, cols);
		
		var cardsOnPlay = arraycards.slice(); // Copiem l'array
		while (cardsOnPlay.length < this.num_cards)
		{
			cardsOnPlay = cardsOnPlay.concat(cardsOnPlay); // Dupliquem els elements
			// La mida augmenta exponencialment, arriba a numcards abans i el slice s'encarregara de la resta
		}
		cardsOnPlay.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		cardsOnPlay = cardsOnPlay.slice(0, this.num_cards); // Agafem els primers numCards elements
		cardsOnPlay = cardsOnPlay.concat(cardsOnPlay); // Dupliquem els elements
		cardsOnPlay.sort(function(){return Math.random() - 0.5}); // Array aleatòria

		arraycards = cardsOnPlay.slice(); // despres de generar les cartes que posarem al tauler, arraycards agafa aquest array generat
		// arraycards es mantindra inalterat fins que posem totes les cartes i backs, cardsOnPlay anira perdent cada vegada el seu primer element

		for (var i = 0; i < cardsOnPlay.length; i++)
		{
			console.log(cardsOnPlay[i]);
		}

		var spaceMult = 0.9;
		var cardWidth = (game.config.width / cols);
		var cardHeight = (game.config.height / fils);
		//console.log(cardWidth, cardHeight);//debug

		/*var cardSpacingX = 100;
		var cardSpacingY = 2;*/

		var halfX = game.config.width / 2;

		var offsetX = 0; // pot ser que tinguem 1 o 2 cartes al mig
		var offsetY = cardHeight * 0.5;

		var placeCard = (X, Y) => // (exemple de function arrow dins de la classe)
		{
			// cartes de cara
			let cardPlaced = cardsOnPlay.shift();
			let aux = this.add.sprite(X, Y, cardPlaced);
			aux.displayHeight = cardHeight*spaceMult;
			aux.scaleX=aux.scaleY;

			// cartes d'esquena per damunt
			aux = this.cards.create(X, Y, 'back');
			aux.displayHeight = cardHeight*spaceMult;
			aux.scaleX=aux.scaleY;

			//console.log(X,Y, cardPlaced);//debug
		}

		for (let f = 0; f < fils; f++) // totes les files menys l'ultima estaran amb seguretat plenes al 100%
		{
			let posY = cardHeight*f + offsetY;

			if (f == fils-1)
			{
				cols = cardsOnPlay.length; // retocar el nombre de columnes exclusives a l'ultima fila
			}
			//console.log(cols);//debug
			let migcols = Math.floor(cols/2) + (cols % 2);
			//console.log(migcols);//debug
			for (let c = 0; c < migcols; c++) // columnes
			{
				if (cols % 2 == 0) offsetX = cardWidth * 0.5;
				let posX = halfX - cardWidth*c - offsetX;
				
				if (c == 0) // columna/es del mig, les primeres que es pinten
				{
					if (cols % 2 == 0)
					{
						placeCard(posX, posY);
					}
					posX = halfX + cardWidth*c + offsetX;
					placeCard(posX, posY);
				}
				else // resta de columnes (per parelles)
				{
					placeCard(posX, posY);
					posX = halfX + cardWidth*c + offsetX;
					placeCard(posX, posY);
				}
			}
		}
		
		var i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = arraycards[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id)
					{
						this.score -= 40/this.num_cards;
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);
						if (this.score <= 0)
						{
							alert("Game Over");
							loadpage("../");
						}
					}
					else
					{
						this.correct++;
						if (this.correct >= this.num_cards)
						{
							alert("You Win with " + Math.round(this.score) + " points.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else
				{
					this.firstClick = card;
				}
			}, card);
		});

	}
	
	update (){	}
}

function getRandomInt(min, max) // (exemple de funcio normal fora de la classe)
{
	return Math.floor(Math.random() * (max-min)) + min;
}