var	game	= new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS,'', {	preload: preload,	create:	create,	update:	update	});
function	preload() {
//ładowanie	zasobów
	game.load.image('sky', 'assets/sky.png');
	game.load.image('ground', 'assets/platform.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}


var	platforms;
var	score	= 0;
// var plat;
var enemy;






function	preload() {
//ładowanie	zasobów
game.load.image('sky', 'assets/sky.png');
game.load.image('ground', 'assets/platform.png');
game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
game.load.spritesheet('enemy', 'assets/enemy.png', 32, 48);
}




function	create() {

	//klawisze enemy
	
	W = game.input.keyboard.addKey(Phaser.Keyboard.W)
	S = game.input.keyboard.addKey(Phaser.Keyboard.S)
	A = game.input.keyboard.addKey(Phaser.Keyboard.A)
	D = game.input.keyboard.addKey(Phaser.Keyboard.D)
	//tworzenie	obiektów
	game.add.sprite(0,	0,	'star');
	//	"Włączamy"	prawa	fizyki
	game.physics.startSystem(Phaser.Physics.ARCADE);	
	//	Dodajemy	tło
	var background = this.game.add.sprite(0,	0,	'sky');

	background.width = game.width;
	background.height = game.height;

	//	Dodajemy	grupę,	do	której	będą	należeć:	gleba	i	półki
	platforms	=	game.add.group();	
	//	Obiekty	wchodzące	w	skład	grupy	uczynimy	ciałem	stałym
	platforms.enableBody	= true;	
	//	Tworzymy	glebę
	
	var	ground	=	platforms.create(0,	game.world.height - 64,	'ground');	
	ground.width = game.width;
	ground.height = game.height*0.1;

	//		Skalujemy	glebę	(powiększamy	2x)
	// ground.scale.setTo(2,	2);	
	//		Unieruchomiamy	glebę
	ground.body.immovable	= true;	
	//		robimy	dwie	półki	i	unieruchomiamy	je
	//var	ledge	=	platforms.create(400,	400,	'ground');	
	//ledge.body.immovable	= true;	
	
	//ledge	=	platforms.create(100,	250,	'ground');	
	//ledge.body.immovable	= true;
	
	// plat = game.add.sprite(200, 360, 'ground');
	// game.physics.arcade.enable(plat);
	// plat.body.immovable	= true;	
	// plat.scale.setTo(0.5,	1);	
	
	//	Tworzę	gracza	('dude')	i	ustawiam	go	na	odpowiedniej	pozycji
	player	=	game.add.sprite(game.world.width*.1 ,	game.world.height*.5, 'dude');
	player.width = game.width*.06;
	player.height = game.height*.09;
	//	Włączam	graczowi	fizykę
	game.physics.arcade.enable(player);
	// game.physics.arcade.enable(plat);
	// grupa wrogów
	enemies = game.add.group();
	enemies.enableBody = true;
	
	enemy = enemies.create(game.width*.5, game.height*.5, 'enemy')

	// enemy	=	game.add.sprite(game.world.width*.5 ,game.world.height*.5, 'enemy');
	enemy.width = game.width*.06;
	enemy.height = game.height*.09;
	//	Włączam	graczowi	fizykę
	game.physics.arcade.enable(enemy);
	
	
	

	//	Nadaję	mu	grawitację	i	współczynnik	sprężystości	(!)
	player.body.bounce.y	= 0.2;
	player.body.gravity.y	= 300;
	player.body.collideWorldBounds	= true;

	enemy.body.bounce.y	= 0.2;
	enemy.body.gravity.y	= 300;
	enemy.body.collideWorldBounds	= true;
	
	


	//	Tworzę	dwie	animacje	(!!!)
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);
	player.animations.add('attackright', [9, 10, 11], 10, true);//atak w prawo
	player.animations.add('attackleft', [14, 13, 12], 10, true);//atak w lewo
	//animacja wroga XD
	enemy.animations.add('enemyleft', [0, 1, 2, 3], 10, true);
	enemy.animations.add('enemyright', [5, 6, 7, 8], 10, true);


	
	scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});


	this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	


    
    //game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR ]);
	

}
function	update() {	
//pętla	główna	gry
	
	if (D.isDown)
	{
	enemy.animations.play('enemyright');
	enemy.body.velocity.x = 60;
	}
	else if (A.isDown)
	{
	enemy.animations.play('enemyleft');
	enemy.body.velocity.x = -60;
	}
	else
	{
		enemy.animations.stop();
		enemy.frame	= 4;
		enemy.body.velocity.x =0;
	}

	if (W.isDown)
	{
		enemy.body.velocity.y	= -350;
	}
	
	else if(S.isDown )
	{
		enemy.body.velocity.y	= 300;
	}

	
	

	game.physics.arcade.collide(player, platforms);
	// game.physics.arcade.collide(player, plat);
	game.physics.arcade.collide(enemy, platforms);
	// game.physics.arcade.collide(enemy, plat);

	game.physics.arcade.overlap(player, enemy, war, null, this);
	// game.physics.arcade.overlap(plat, null, this);
	// plat.body.velocity.x = -50;

	//	Dodajemy	kolizje	gracza	z	grupą	obiektów	platforms
	//	Włączmy	sterowanie	strzałkami
	cursors	=	game.input.keyboard.createCursorKeys();
	//	Na	początek	postaw	go	nie	ruszaj
	player.body.velocity.x	= 0;
	if (cursors.left.isDown)
	{
		//	Prędkość:	150	pikseli/sekundę	w	lewo	(x	-=	150)
		player.body.velocity.x	= -100;
		//	Animuj
		if(this.spaceKey.isDown)
		{
			player.animations.play('attackleft');
		}
		else
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		//	Prędkość:	150	pikseli/sekundę	w	prawo	(x	+=	150)
		player.body.velocity.x	= 100;
		//	Animuj
		if(this.spaceKey.isDown)
		{
			player.animations.play('attackright');
		}
		else
		player.animations.play('right');
	}
	else if(this.spaceKey.isDown)
	{
		player.animations.play('attackright');
	}
	else
	{
		//	Jak	nic	nie	naciskam	to	nie	ruszaj	go	i...	wyświetlaj	4	klatkę	sprita
		player.animations.stop();
		player.frame	= 4;
	}
	//		Dodaj	skoki	(!!!)
	


	if (cursors.up.isDown	&&	player.body.touching.down)
	{
		player.body.velocity.y	= -350;
	}
	
	else if(cursors.down.isDown )
	{
		player.body.velocity.y	= 300;
	}

	
	}

	

var	scoreText;

function war(player, enemy){
	if(this.spaceKey.isDown)
	{
		score++;
		scoreText.text = 'Score: ' + score;
		enemy.kill()
		newEnemy();
		
	}
	else
	{
		if(enemy.body.x > player.body.x)
		{
			player.body.x -= 100;
			
		}
		else if(enemy.body.x < player.body.x)
		{
			player.body.x +=  100;
			
		}
	}


 }

 function newEnemy (){
	enemy=	enemies.create(game.width*.5, game.height*.5, 'enemy');
	enemy.width = game.width*.06;
	enemy.height = game.height*.09;
	game.physics.arcade.enable(enemy);
	enemy.body.bounce.y	= 0.2;
	enemy.body.gravity.y	= 300;
	enemy.body.collideWorldBounds	= true;

	 	

 }