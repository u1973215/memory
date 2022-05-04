class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.cardPairs = 2;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}
	
    create (){	
		let arraycards = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
		this.cameras.main.setBackgroundColor(0xF2F2CE);
		
		this.cards = this.physics.add.staticGroup();

		var totalCards = this.cardPairs * 2;

		var cardWidth = game.config.width / totalCards;
		var cardHeight = game.config.height / this.cardPairs;

		/*var cardSpacingX = 100;
		var cardSpacingY = 2;*/
		var startX = game.config.width / 2 - cardWidth * 0.5;
		var startY = game.config.height / 2 - cardHeight * 0.5;

		let fils = 0, cols = 0;
		for(let i = 0; i < totalCards; i++) // matriu
		{
			let randomCard = getRandomInt(0,arraycards.length);

			let aux = this.add.sprite(startX+cols*cardWidth, startY+fils*cardHeight, arraycards[randomCard]);
			aux.displayWidth = cardWidth;
			aux.scaleY=aux.scaleX;
			/*
			aux = this.cards.create(startX+i*cardSpacingX, 300, 'back');
			aux.displayWidth=game.config.width*0.4/this.cardPairs;
			aux.scaleY=aux.scaleX;
			*/

		}
		
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = arraycards[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
					if (this.firstClick.card_id !== card.card_id){
						this.score -= 20;
						this.firstClick.enableBody(false, 0, 0, true, true);
						card.enableBody(false, 0, 0, true, true);
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= 2){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
	}
	
	update (){	}
}

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max-min)) + min;
}