/**
 * Constants
 */
const SPACE_CHARACTER = " ";

/**
 * Deug function
 * @param  {...Integer} items 
 */
var d = function(...items){
    let logText = items.map((x) => JSON.stringify(x)).join(SPACE_CHARACTER);    
    printErr(logText);
}

/**
 * Game.JS
 */
var Game = function(context, options){
    let opts = options === undefined ? {} : options;
    
    // Attributes 
    this.N          = opts.N || null;       // the total number of nodes in the level, including the gateways
    this.L          = opts.L || null;       // the number of links
    this.E          = opts.E || null;       // the number of exit
    
    this.nodes      = opts.nodes || null;   // the all nodes present in the game.
    this.links      = opts.links || null;   // the links present in the game. 
    
    this.loopCount      = null;             // the number of game loop 
    this.agentPositions = [];               // The list of different positions taken by the Skynet agent.

    
    this.console = opts.console || this.defaultInputReader(context);
    
};

Game.prototype.defaultInputReader = function(context){
    let ctx = context || this;
    
    return {
        /**
         * Return the user intput as a single value
         * @return {Integer} 
         */
        input:  function(){
            return parseInt(ctx.readline());    
        },

        /**
         * Return the user intput as a list of values
         * @return {Array[Integer]} 
         */
        inputs: function(){
            return ctx.readline().split(SPACE_CHARACTER).map((x) => { return parseInt(x); });
        },
    
    }
};


var g = new Game(this);

var inputs = g.console.inputs();
g.N = inputs[0]; // the total number of nodes in the level, including the gateways
g.L = inputs[1]; // the number of links
g.E = inputs[2]; // the number of exit gateways


for (var i = 0; i < g.L; i++) {
    var inputs = g.console.inputs();
    var N1 = inputs[0]; // N1 and N2 defines a link between these nodes
    var N2 = inputs[1];
    d("(N1,N2)",N1,N2);    
    
}
for (var i = 0; i < g.E; i++) {
    var EI = g.console.input(); // the index of a gateway node
    d("EI", EI);
}

// game loop
while (true) {
    var SI = g.console.input(); // The index of the node on which the Skynet agent is positioned this turn
    d("SI", SI);
    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print('0 1'); // Example: 0 1 are the indices of the nodes you wish to sever the link between
}



