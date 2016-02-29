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
}


/**
 * Node object
 */
var Node = (id, reachable) => { 
    this.id         = id        || null;
    this.reachable  = reachable || false;
    this.next       = new Set();
}
Node.prototype.isReachable = () => {
    return this.reachable;
}
Node.prototype.linkTo = (N2) => {
    this.next.add(N2);
    return this;
}


/**
 * Game.JS
 */
var Game = (context, options) => {
    let opts    = options === undefined ? {} : options;
    let entries = opts.entries || {};
    
    // Attributes 
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
            input:  function() {
                return parseInt(ctx.readline());    
            },

            /**
             * Return the user intput as a list of values
             * @return {Array[Integer]} 
             */
            inputs: function() {
                return ctx.readline().split(SPACE_CHARACTER).map((x) => { return parseInt(x); });
            },
        
        }
    }
    this.console = opts.console || this.defaultInputReader(context);

    // Initializer 
    let initialize = (entries) => {
        if ( !entries.length ) { // No entries provided as options
            // Assigning number of nodes, links and exit gateways
            [this.N, this.L, this.E] = this.console.inputs();
            d("Setting N,L,E", this);
        
            // Init nodes
            this.nodes = new Set();
            for (var i = 0; i < this.L; i++) {
                let [N1, N2] = g.console.inputs();
                let node = new Node(N1).LinkTo(N2);
                d("Adding node", node)
                this.nodes.add(node);    
            }
        }
        
        for (var i = 0; i < g.E; i++) {
            var EI = g.console.input(); // the index of a gateway node
            d("EI", EI);

        }
    }
    
};

};


var g = new Game(this);



// game loop
while (true) {
    var SI = g.console.input(); // The index of the node on which the Skynet agent is positioned this turn
    d("SI", SI);
    // Write an action using print()
    // To debug: printErr('Debug messages...');

    print('0 1'); // Example: 0 1 are the indices of the nodes you wish to sever the link between
}



