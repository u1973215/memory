
class GameScene extends Phaser.Scene
{
    constructor ()
	{
        super('GameScene');
		this.username = '';
		this.num_pairs = 1;
		this.items = [];
		this.cards = null; // objectes carta: no es poden carregar ni tan sols transformar a JSON
		this.cardsInfo = []; // informacio que ens interessa de this.cards (cada item = {done: false})
		this.firstClick = null; // carta del primer click (objecte)
		this.currentCard = null; // carta del primer click (posicio de la carta dins cardsInfo)
		this.score = 100; 
		this.correct = 0;
		
		this.cooldown = 500;

		this.local_save = () =>
		{
			console.log(this);
			let partida = {
				username: this.username,
				num_pairs: this.num_pairs,
				cards: this.cards,
				items: this.items,
				firstClick: this.firstClick,
				score: this.score,
				correct: this.correct
			}
			console.log(partida);
			let arrayPartides = [];
			if(localStorage.partides){
				arrayPartides = JSON.parse(localStorage.partides);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
			}
			arrayPartides.push(partida);
			console.log(arrayPartides);
			localStorage.partides = JSON.stringify(arrayPartides);
			//loadpage("../index.html");
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
		this.cameras.main.setBackgroundColor(0xF2F2CE);

		var saveButton = document.getElementById("save-button");
		saveButton.addEventListener("click", this.local_save);

		this.cards = this.physics.add.staticGroup();
		this.items = ['cb', 'co', 'sb', 'so', 'tb', 'to']; // inicialment, this.items conte totes les possibles cartes

		let l_partida = null;

		if (sessionStorage.idPartida && localStorage.partides)
		{
			console.log("exiteix la partida");
			let arrayPartides = JSON.parse(localStorage.partides);
			if (sessionStorage.idPartida < arrayPartides.length)
				l_partida = arrayPartides[sessionStorage.idPartida];
		}
		
		if (l_partida){
			this.username = l_partida.username,
			this.num_pairs = l_partida.num_pairs,
			this.cards = l_partida.cards,
			this.items = l_partida.items,
			this.firstClick = l_partida.firstClick,
			this.score = l_partida.score,
			this.correct = l_partida.correct
			console.log("partida found");
		}
		else{
			////////////////////////////////////////
			var json = localStorage.getItem("config") || '{"cards": 3,"dificulty": "hard"}';
			var options_data = JSON.parse(json);
			this.num_pairs = options_data.cards;

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
			//console.log(this.dif_mult);
			////////////////////////////////////////

			this.username = sessionStorage.getItem("username","unknown");
			//console.log(this);
		}
		sessionStorage.clear();

		var totalCards = this.num_pairs * 2;

		// do magic here
		var fils = Math.round(Math.sqrt(totalCards));
		var cols = Math.ceil(Math.sqrt(totalCards));

		//console.log(totalCards);
		//console.log(fils, cols);
		
		var cardsOnPlay = this.items.slice(); // Copiem l'array
		while (cardsOnPlay.length < this.num_pairs)
		{
			cardsOnPlay = cardsOnPlay.concat(cardsOnPlay); // Dupliquem els elements
			// La mida augmenta exponencialment, arriba a numcards abans i el slice s'encarregara de la resta
		}
		cardsOnPlay.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		cardsOnPlay = cardsOnPlay.slice(0, this.num_pairs); // Agafem els primers numCards elements
		cardsOnPlay = cardsOnPlay.concat(cardsOnPlay); // Dupliquem els elements
		cardsOnPlay.sort(function(){return Math.random() - 0.5}); // Array aleatòria

		this.items = cardsOnPlay.slice(); // despres de generar les cartes que posarem al tauler, this.items agafa aquest array generat
		// this.items es mantindra inalterat fins que posem totes les cartes i backs, cardsOnPlay anira perdent cada vegada el seu primer element

		for (var i = 0; i < cardsOnPlay.length; i++)
		{
			//console.log(cardsOnPlay[i]);
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
		
		var canClick = true;
		var i = 0;
		

		this.cards.children.iterate((card)=>{
			var hideCards = () =>
			{
				//console.log(this);
				this.firstClick.enableBody(false, 0, 0, true, true);
				card.enableBody(false, 0, 0, true, true);
			}

			var processSecondCard = () =>
			{
				if (this.firstClick.card_id !== card.card_id)
				{
					this.score -= 40/this.num_pairs;
					hideCards();
					if (this.score <= 0)
					{
						alert("Game Over");
						loadpage("../");
					}
				}
				else
				{
					this.correct++;
					if (this.correct >= this.num_pairs)
					{
						alert("You Win with " + Math.round(this.score) + " points.");
						loadpage("../");
					}
				}
				this.firstClick = null;
				canClick = true;
			}

			var cardInfo = {
				done: false
			}

			card.card_id = this.items[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				if (canClick)
				{
					card.disableBody(true,true);
					if (this.firstClick)
					{
						canClick = false;
						this.time.delayedCall(this.cooldown, processSecondCard, this);
					}
					else
					{
						this.firstClick = card;
					}
				}
			}, card);
		});

	}
	
	update ()
	{

	}
}

function getRandomInt(min, max) // (exemple de funcio normal fora de la classe)
{
	return Math.floor(Math.random() * (max-min)) + min;
}

