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


/**
 * Network
 */
var Network = {
    N: null,       // the total number of nodes in the level, including the gateways
    L: null,       // the number of links
    E: null,       // the number of exit
    
    nodes: null,   // the all nodes present in the game.
    links: null,   // the links present in the game. 
    gateways: null,   // the list of gateways present in the game. 
}
Network.prototype.initialize = function(options) {
    d("[initialize] Start", this);

    let opts = options || {};
    this.hasEntriesProvidedAsOptions = (opts.length) ? true : false
    
    this.console = opts.console || null // The Game console to get user inputs.
    
    if ( this.hasEntriesProvidedAsOptions ) { // Entries are provided as options
        d("Setting attributes for options", opts);
        this.N = opts.N;       
        this.L = opts.L;       
        this.E = opts.E;       
        
        this.nodes      = opts.nodes;
        this.links      = opts.links;
        this.gateways   = new Set(opts.gateways);
    } else { // No Entries provided, try with user inputs.
        if ( this.console ) {
            this.initGlobalConstants();
            this.initNodes();
            this.initLinks(console);
            this.initGateways(console);    
        } else {
            throw "NoConsoleProvidedError: You must set the 'console' options to be able to get user inputs";   
        }
        
    }
    
    d("[initialize] Done", this);
    
    return this;
};

Network.prototype.initGlobalConstants = function (console) {
    d("[initGlobalConstants] Start");
    [this.N, this.L, this.E] = console.inputs();
    d("[initGlobalConstants] Done", "N="+this.N+" L="+this.L+" E="+this.E);
}

Network.prototype.initNodes = function () {
    d("[initNodes] Start", this);
    this.nodes = [];
    for (let i = 0; i < this.N; i++) {
        let node = new Node(i);
        this.nodes.push(node);
        d("Adding node", node)    
    }
    d("[initNodes] Done", this.nodes);
}

Network.prototype.initLinks = function (console) {
    d("[initGlobalConstants] Start");
    for (let i = 0; i < this.L; i++) {
        let [N1, N2] = console.inputs();
        
        let node = this.nodes[N1];
        node.linkTo(N2)
        d("Linking Node["+N2+"] to node", node);    
    }
    d("[initGlobalConstants] Done", this);
}

Network.prototype.initGateways = function (console) {
    d("[initGateways] Start");
    this.gateways = new Set();
    for (i = 0; i < this.E; i++) {
        var EI = console.input(); // the index of a gateway node
        d("Adding gateway", EI);
        this.gateways.add(EI);
    }
    d("[initGateways] Done", this.gateways);
}

/**
 * Check if is ther any gateway at the given indice.
 *
 * @param  {Integer}  indice of the Node.
 * @return {Boolean}  whether or not is the related Node is a Gateway.
 */
Network.prototype.hasAnyGatewayAt = function(indice) {
    return this.gateways.has(indice);
}


/**
 * hasBeenInfectedBy : Allow to the virus the visit the class 
 * Implements Visitor Design Pattern
 * 
 * @param  {Virus}  virus 
 */
Network.hasBeenInfectedBy = function (virus) {
    virus.infects(this);
}

/**
 * Virus
 */
var Virus = { 
    infectedNetwork: null
};
Virus.prototype.infects = function (network) {
    this.infectedNetwork = network;
};
Virus.prototype.breakLinksFromAgentPos = function (pos) {
    let net;

    if (!this.infectedNetwork) { // No network infected
        trow "MissingNetworkToInfectError: You nedd to infect a network first. use 'Virus.infect' method."
    } else {
        net = this.infectedNetwork;

        let nextNodes = net.nodes[pos].next;
        // Find all next Node that linked to a gateway.
        nextNodes.forEach((indice) => {
            let next = net.nodes[indice].next;
            next.forEach((i) => {
                if (net.hasAnyGatewayAt(i)) {
                    this.BreakLinkAt(indice, i);
                }    
            })
        });    
    }
};
Virus.prototype.breakLinkAt = function (N1, N2) {
    print [N1, N2].join(SPACE_CHARACTER);
}


var virus   = new Virus();
var network = new Network();

var g = new Game(this);
g.loop();



