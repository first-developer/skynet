/**
 * Constants
 */
const SPACE_CHARACTER = " ";
const DEBUG=1
/**
 * Deug function
 * @param  {...Integer} items 
 */
var d = (...items) => {
    if (DEBUG) {
        let logText = items.map((x) => JSON.stringify(x)).join(SPACE_CHARACTER);    
        printErr(logText);
    }
};


/**
 * GNode object : Game Node
 */
var GNode = function(id) { 
    this.id         = id;
    this.next       = [];
};

GNode.prototype.linkTo = function(N2) {
    this.next.push(N2);
    return this;
};

/**
 * Console
 */
var Console = function (context) {

    /**
     * Return the user intput as a single value
     * @return {Integer} 
     */
    this.input = () => {
        return parseInt(context.readline());    
    };

    /**
     * Return the user intput as a list of values
     * @return {Array[Integer]} 
     */
    this.inputs = () => {
        return context.readline().split(SPACE_CHARACTER).map((x) => { return parseInt(x); });
    };

}
    
    
/**
 * Game
 */
var Game = function(context, options) {
    let opts    = options === undefined ? {} : options;
    
    // Attributes 
    this.virus   = opts.virus   || null;
    this.network = opts.network || null;
    if( !this.virus || !this.network ) {
        throw "MissingOptionValuesError: You must provide 'virus' and 'virus' as an options."    
    }
    
    this.loopCount      = null;             // the number of game loop 
    this.agentPositions = [];               // The list of different positions taken by the Skynet agent.
    
    this.console = opts.console || new Console(context);
    
    d("console", this.console, "opts", opts);
    
    this.initialize(opts);
};

Game.prototype.initialize = function (options) {
    d("[Game.initialize] Start", this, options);
    this.network.initialize(this.console, options);
    this.network.hasBeenInfectedBy(this.virus);
    d("[Game.initialize] Done", this);
}

Game.prototype.loop = function () {
    
    // Game loop
    while (true) {
        var SI = this.console.input(); // The index of the node on which the Skynet agent is positioned this turn
        d("Skynet agent position", SI);
        
        this.virus.MarkLinksAsBrockenWhenAgentMoveTo(SI);
        this.network.removeBrokenLinks
    }
}


/**
 * Network
 */
var Network = function (options) {
    let opts = options || {};
    this.hasAttrsProvidedAsOptions = (opts.length) ? true : false
    
    this.N   = opts.N || null;       // the total number of nodes in the level, including the gateways
    this.L   = opts.L || null;       // the number of links
    this.E   = opts.E || null;       // the number of exit
    
    this.nodes    = opts.nodes    || null;  // the all nodes present in the game.
    this.links    = opts.links    || null;  // the links present in the game. 
    
    this.gateways = new Set(opts.gateways) || null;  // the list of gateways present in the game. 
    
    this.breakingLinks = [];    // the links the virus should break. 
}

Network.prototype.initialize = function(console, options) {
    d("[Network.initialize] Start", this, console, options);
    
    this.console = console || null; // The Game console to get user inputs.

    if ( this.hasAttrsProvidedAsOptions ) { // No Entries provided, try with user inputs.
        d("Already initialized through the given options values");
    } else {
        if ( this.console ) {
            this.initGlobalConstants();
            this.initNodes();
            this.initLinks();
            this.initGateways();    
        } else {
            throw "NoConsoleProvidedError: You must set the 'console' options to be able to get user inputs";   
        }
        
    }
    
    d("[Network.initialize] Done", this);
};

Network.prototype.initGlobalConstants = function () {
    d("[Network.initGlobalConstants] Start");
    [this.N, this.L, this.E] = this.console.inputs();
    d("[Network.initGlobalConstants] Done", "N="+this.N+" L="+this.L+" E="+this.E);
}

Network.prototype.initNodes = function () {
    d("[Network.initNodes] Start", this);
    this.nodes = [];
    this.links = [];
    for (let i = 0; i < this.N; i++) {
        let node = new GNode(i);
        
        this.links[i] = [0,0];  
        
        d("Adding node", node); 
        this.nodes.push(node);  
    }
    d("[Network.initNodes] Done", this.nodes);
}

Network.prototype.initLinks = function () {
    d("[Network.initLinks] Start");
    for (let i = 0; i < this.L; i++) {
        let [N1, N2] = this.console.inputs();
        
        let node = this.nodes[N1];
        node.linkTo(N2);
        
        this.links[N1][N2] = 1;
        d("Linking Node["+N2+"] to node", node, "links["+N1+"]["+N2+"]", this.links[N1][N2]);    
    }
    d("[Network.initLinks] Done", this);
}

Network.prototype.initGateways = function () {
    d("[Network.initGateways] Start");
    this.gateways = new Set();
    for (i = 0; i < this.E; i++) {
        var EI = this.console.input(); // the index of a gateway node
        d("Adding gateway", EI);
        this.gateways.add(EI);
    }
    d("[Network.initGateways] Done", ...this.gateways);
}

/**
 * Check if is ther any gateway at the given indice.
 *
 * @param  {Integer}  indice of the Node.
 * @return {Boolean}  whether or not is the related Node is a Gateway.
 */
Network.prototype.hasAnyGatewayAt = function(indice) {
    d("[hasAnyGatewayAt] Start")
    return this.gateways.has(indice);
}

Network.prototype.checkGatewaysAt = function(indice1, indice2) {
    d("[checkGatewaysAt] Start")
    if( this.hasAnyGatewayAt(indice1) ){
        this.addBreakingLink(indice1, indice2);   
    }
}

Network.prototype.checkLinkWithGatewayAt = function(indice) {
    d("[checkLinkWithGatewayAt] Start")
    for (let gate of this.gateways) { // Loop through all gateways.        
        let leftLinkFound   = (this.links[indice][gate] == 1);
        let rightLinkFound  = (this.links[gate][indice] == 1);
        d("[checkLinkWithGatewayAt]  gate="+gate+" index="+indice+" leftLinkFound="+leftLinkFound+" rightLinkFound="+rightLinkFound);
        if ( !(leftLinkFound || rightLinkFound) ) {
            d("Nothing yet to do");
        } else {
            if (leftLinkFound ) { this.addBreakingLink(indice, gate);  }
            if (rightLinkFound) { this.addBreakingLink(gate, indice); }
            break;
        }
    }
}

Network.prototype.addBreakingLink = function(N1, N2) {
    d("Adding link", "N1="+N1+" N2="+N2)
    //this.breakingLinks.push([N1, N2]); 
    print([N1, N2].join(SPACE_CHARACTER));
} 

Network.prototype.removeBrokenLinks = function() {
    d("removing links", this.breakingLinks)
    
    for (let i=0; i<this.breakingLinks.length; i++) {
        print(this.breakingLinks[i].join(SPACE_CHARACTER));   
    }
} 


/**
 * hasBeenInfectedBy : Allow to the virus the visit the class 
 * Implements Visitor Design Pattern
 * 
 * @param  {Virus}  virus 
 */
Network.prototype.hasBeenInfectedBy = function (virus) {
    virus.infects(this);
}


/**
 * Virus
 */
var Virus = function () {
    this.infectedNetwork = null;
};

Virus.prototype.infects = function (network) {
    this.infectedNetwork = network;
};
Virus.prototype.MarkLinksAsBrockenWhenAgentMoveTo = function (pos) {
    let net;

    if (!this.infectedNetwork) { // No network infected
        throw "MissingNetworkToInfectError: You nedd to infect a network first. use 'Virus.infect' method.";
    } else {
        net = this.infectedNetwork;

        this.breakNextLinks(pos, [pos]);
    }
};

Virus.prototype.breakNextLinks = function(lastIndice, next) {
    let indice, node;
    
    
    let net = this.infectedNetwork;
    
    if (!next.length) {
        return    
    } else {
        indice = next.sort().shift();
        node   = net.nodes[indice];
        d("[Virus.breakNextLinks]", "indice", indice, "node", node); 
       
        net.checkGatewaysAt(indice, lastIndice);
        net.checkLinkWithGatewayAt(indice);
        
        d("[Virus.breakNextLinks]", "lastIndice", lastIndice,"indice", 
                indice, "net.hasAnyGatewayAt("+indice+")", net.hasAnyGatewayAt(indice), "next", next,"rest", node.next);    
        this.breakNextLinks(indice, next);
        this.breakNextLinks(indice, node.next);  
    }
}

Virus.prototype.breakLinkAt = function (N1, N2) {
    let linkToRemove = [N1, N2].join(SPACE_CHARACTER);
    d("Link removed ", linkToRemove);
    print(linkToRemove);
}



var g = new Game(this, {
        virus:  new Virus(),
        network: new Network()
    });
g.loop();



