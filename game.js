/**
 * Constants
 */
const SPACE_CHARACTER = " ";

/**
 * Deug function
 * @param  {...Integer} items 
 */
var d = (...items) => {
    let logText = items.map((x) => JSON.stringify(x)).join(SPACE_CHARACTER);    
    printErr(logText);
};


/**
 * Node object
 */
var Node = function(id, reachable) { 
    this.id         = id        || null;
    this.next       = [];
};

Node.prototype.linkTo = function(N2) {
    this.next.push(N2);
    return this;
};


/**
 * Game.JS
 */
var Game = function(context, options) {
    let opts    = options === undefined ? {} : options;
    let network = opts.network || {};   
    
    // Attributes 
    this.hasEntriesProvidedAsOptions = (network.length) ? true : false
    
    this.loopCount      = null;             // the number of game loop 
    this.agentPositions = [];               // The list of different positions taken by the Skynet agent.
    
    let defaultInputReader = (context) => {
        let ctx = context || this;
    
        return {
            /**
             * Return the user intput as a single value
             * @return {Integer} 
             */
            input:  () => {
                return parseInt(ctx.readline());    
            },

            /**
             * Return the user intput as a list of values
             * @return {Array[Integer]} 
             */
            inputs: () => {
                return ctx.readline().split(SPACE_CHARACTER).map((x) => { return parseInt(x); });
            },
        
        }
    }
    this.console = opts.console || defaultInputReader(context);
};


Game.prototype.loop = function() {
    this.initialize();
    
    
    // Game loop
    while (true) {
        var SI = this.console.input(); // The index of the node on which the Skynet agent is positioned this turn
        d("Skynet agent position", SI);
        
        print('0 1'); // Example: 0 1 are the indices of the nodes you wish to sever the link between
    }
}

var g = new Game(this);

var Network = {
    N: null;       // the total number of nodes in the level, including the gateways
    L: null;       // the number of links
    E: null;       // the number of exit
    
    nodes: null;   // the all nodes present in the game.
    links: null;   // the links present in the game. 
    gateways: null;   // the list of gateways present in the game. 
}
Network.prototype.initialize

var Virus = {};
Virus.prototype.breakLinksFromAgentPos = function (pos) {

};

// game loop
g.loop();



