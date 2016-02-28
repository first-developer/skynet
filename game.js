/**
 * Constants
 */
let SPACE_CHARACTER = " " 

/**
 * Game.JS
 */
var Game = function(){
	// Attributes 
	this.loopCount = null,	// the number of game loop 
	this.N = null,			// the total number of nodes in the level, including the gateways
	this.L = null,			// the number of links
	this.E = null,			// the number of exit
	this.nodes = null, 		// the all nodes present in the game.
	this.links = null,		// the links present in the game. 
	this.agentPositions = [] // The list of different positions taken by the Skynet agent.



	// Utils functions 
	// ----------------

	/**
	 * Return the user intput as a single value
	 * @return {Integer} 
	 */
	Game.prototype.input = function(){
		return parseInt(readline());	
	}

	/**
	 * Return the user intput as a list of values
	 * @return {Array[Integer]} 
	 */
	Game.prototype.inputs = function(){
		return readline().split(SPACE_CHARACTER)
			.map((x) => { parseInt(x); });	;
	}

}
	





