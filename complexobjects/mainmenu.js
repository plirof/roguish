/**
 * Main menu form, which is displayed at the beginning of the game
 */
function mainForm() {
	var fields = [{
		text: 'New Game!',
		type: 'button',
		callback: function() {
			mainMenu.hide()
			console.log('click');
			selectPlayers(mainMenu);
		}
	},{
		text: 'high scores',
		type: 'button',
		callback: function(){
			mainMenu.hide()
			console.log('highscores');
		}
	}
	];
	var options = {
		header:"rougish",
		message:'a game produced in cis422'
	}

	var mainMenu = new Form(0,0,fields, options);
	mainMenu.render();
}

/**
 * Select map menu form. This function is not used
 * @param  {function} previous previous menu item, this menu hides
 */
function selectMap() {
	var fields = [
	{
		text: 'map',
		type: 'select',
		options: ['dungeon', 'outside'],
		id: 'mapname'
	},
	{
		text: 'back',
		type: 'button',
		callback: function() {
			newGame.hide();
			mainForm();
		}
	}, {
		text: 'next',
		type: 'button',
		callback: function() {
			newGame.hide();
			selectPlayers(newGame);
			isDemo = false;
		}
	}];

	var newGame = new Form(fields);
	newGame.render();
}

/**
 * The menu for selecting the number of players
 * @param  {function} previous previous menu item, that this menu hides
 */
function selectPlayers() {
	var fields = [
	{
		type: 'range',
		id: 'numberOfPlayers',
		min: 1,
		max: 4
	},
	{
		text: 'Next',
		type: 'button',
		callback: function() {
			players.hide();
			namePlayers(parseInt(players.getValue("numberOfPlayers")), []);
		}
	}];

	var players = new Form(fields, {header:"players"});
	players.render();
}

/**
 * The menus for naming each player. creates a menu with a text field for player name input]
 * @param  {number} numPlayers The number of players chosen, the dialog will be displayed this number of times.
 * @param  {string[]} names      The list of names added recursively in this function.
 */
function namePlayers(numPlayers, names) {
	if (names.length == numPlayers) {
		activeObjects = [];
		renderer.centered = true;
		maploader.loadMap('dungeon.json', function() {
			for (var i = 0; i < numPlayers; i++) {
				var player = new Player(i * 16 + parseInt(startPoint.x), i * 16 + parseInt(startPoint.y), 10);
				player.setName(names[i]);
				activeObjects.push(player);
				updateFogOfWar(player);
			}
		}.bind(this));

		return;
	}

	var fields = [
	{
		type: "basic-text",
		text: "Player " + (names.length + 1) + " name:"
	},
	{
		type: "text",
		id: "player" + names.length,
	},
	{
		type: "button",
		text: names.length == numPlayers - 1 ? "Start Game" : "Next",
		callback: function() {
			if(names.length == numPlayers -1){
				$("#playermenu").show();
				$("#backtomain").show();
			}
			startGame.hide();
			names.push(startGame.getValue('player' + names.length));
			namePlayers(numPlayers, names);
		}
	}];

	var startGame = new Form(fields, {header:"names"});
	startGame.render();
}

function backToMain(){
	var fields = [
	{
		type: "button",
		text: "quit",
		callback: function() {
			confirm(backToMain, function(){
				location.reload();
			})
		}
	},
	{
		type: "button",
		text: "continue",
		callback: function() {
			backToMain.hide();
		}
	}];

	var backToMain = new Form(fields, {header:"Pause"});
	backToMain.render();
}

function confirm(previous, callback){
	previous.hide()
	var fields = [
	{
		type:"button",
		text: "yes",
		callback: callback
	},
	{
		type:"button",
		text:"no",
		callback: function(){
			confirm.hide();
			previous.render();
		}
	}];

	var confirm = new Form(fields, {header:"are you sure?"});
	confirm.render();
}

mainForm();