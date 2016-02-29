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
    this.next       = new Set();
};

Node.prototype.linkTo = function(N2) {
    this.next.add(N2);
    return this;
};


/**
 * Game.JS
 */
var Game = function(context, options) {
    let opts    = options === undefined ? {} : options;
    let entries = opts.entries || {};
    
    
    // Attributes 
    this.hasEntriesProvidedAsOptions = (entries.length) ? true : false
    
    this.N          = entries.N || null;       // the total number of nodes in the level, including the gateways
    this.L          = entries.L || null;       // the number of links
    this.E          = entries.E || null;       // the number of exit
    
    this.nodes      = new Set(entries.nodes) || null;   // the all nodes present in the game.
    this.links      = entries.links          || null;   // the links present in the game. 
    this.gateways   = entries.gateways       || null;   // the list of gateways present in the game. 
    
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

Game.prototype.initialize = function() {
    let i;
    
    if ( !this.hasEntriesProvidedAsOptions ) { // No entries provided as options
        // Assigning number of nodes, links and exit gateways
        [this.N, this.L, this.E] = this.console.inputs();
        d("Setting N,L,E", this);
    
        // Init nodes
        this.nodes = new Set();
        for (i = 0; i < this.L; i++) {
            let [N1, N2] = g.console.inputs();
            let node = new Node(N1);
            this.nodes.add(node.linkTo(N2));
            d("Adding node", node)    
        }

        // Init gateways
        this.gateways = new Set();
        for (i = 0; i < this.E; i++) {
            var EI = g.console.input(); // the index of a gateway node
            d("Adding gateway", EI);
            this.gateways.add(EI);
        }
    }
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



// game loop
g.loop();
