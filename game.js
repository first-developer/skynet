/**
 * ------------------------------------------
 * Utils
 * ------------------------------------------
 */

var d = function(...any){
    printErr(JSON.stringify(any));    
}


/**
 * ------------------------------------------
 * NetworkNode
 * ------------------------------------------
 */

var NetworkNode = function(id){
    this.id   = id;
    this.next = [];
};

/**
 * Add a node ID to the list of self's neighbours
 * @param  {Integer} nodeId 
 */
NetworkNode.prototype.linkTo = function(nodeId){
    this.next.push(nodeId);    
};

/**
 * Check if the given node has its ID as a neighbour
 * @param  {NetworkNode}  node 
 * @return {Boolean}     
 */
NetworkNode.prototype.isLinkedTo = function(node){
    for (let i=0; i<this.next.length; i++) {
        let nextNode = this.next[i];
        if (node.id == nextNode) {
            return true;   
        }
    }
    
    return false;
};
 
 
/**
 * ------------------------------------------
 * Agent
 * ------------------------------------------
 */
var Agent = function(){};

/**
 * Return the new position of the Agent.
 * @return {int} The agent position
 */
Agent.prototype.moving = function(){
    return parseInt(readline());
}


/**
 * ------------------------------------------
 * Virus
 * ------------------------------------------
 */
var Virus = function(){
    this.targetNetwork       = null;
    this.currentAgentPosition = null;
};

/**
 * Set the reference of the network to the Virus.
 * @param {Network} network
 * @return self
 */
Virus.prototype.infects = function(network){
   this.targetNetwork = network;
   return this;
}

/**
 * Show the result output as describe in the instructions 
 * It actually break the link between the nodes with the given IDs. 
 * @param {Interger} N1
 * @param {Interger} N2
 */
Virus.prototype.brokeLinkBetween = function(N1, N2) {
    print([N1, N2].join(' '));
}

/**
 * Break to node by checking in which order it has to be done.
 * It is related the link order between the two nodes.
 * 
 * @param  {NetworkNode} node1
 * @param  {NetworkNode} node2
 */
Virus.prototype.brokeLinkOrTryTheOtherWay = function(node1, node2) {
    
    if ( node1.isLinkedTo(node2) ) {
        this.brokeLinkBetween(node1.id, node2.id);       
    } else {
        if ( node2.isLinkedTo(node1) ) {
            this.brokeLinkBetween(node2.id, node1.id);       
        }
    }
}

/**
 * Break the link between the Agent an any other nodes, gateways and neighbours
 * to revent the Agent to reached the gateway.
 * 
 * @param  {[Integer]} rest : les list of neighbours node IDs of a node.
 */
Virus.prototype.recursiveBreak = function(rest) {
    let n,
        g,
        network,
        gNode,
        nNode;
    
    network = this.targetNetwork;
    
    if (!rest.length) {
        nNode = network.nodeAt(this.currentAgentPosition); // node at indice 'n'
        
        // remove all links between the node and any existing gateway
        for (i=0; i<network.gateways.length; i++) { 
            g     = network.gateways[i];
            gNode = network.nodeAt(g);   // node at indice 'g'
            
            this.brokeLinkOrTryTheOtherWay(nNode, gNode);
        }
    } else {
        n = rest.shift();  
        nNode = network.nodeAt(n); // node at indice 'n'
        
        if ( network.hasGateway(n) ) { // A gateway is found inside first neighbours
            this.brokeLinkBetween(this.currentAgentPosition, n);
        } else {
            // remove all links between the node and any existing gateway
            for (i=0; i<network.gateways.length; i++) { 
                g     = network.gateways[i];
                gNode = network.nodeAt(g);   // node at indice 'g'
                
                this.brokeLinkOrTryTheOtherWay(nNode, gNode);
            }
        }
        
        this.recursiveBreak(rest);
        this.recursiveBreak(nNode.next); // Try also on neighbours.
    }
};

/**
 * Appl ythe algorithm to stop the Agent
 * 
 * @param  {Integer} agentPosition 
 * @return self
 */
Virus.prototype.blocks = function(agentPosition){
    let i;
    let network = this.targetNetwork;
    this.currentAgentPosition = agentPosition;

    if ( !network ) {
        throw "NotNetworkFoundError: You need to infects a network first."       
    } 

    let nextAgentEventualMoves = network.nodeAt(this.currentAgentPosition).next.sort();
    
    this.recursiveBreak(nextAgentEventualMoves);
    
    return this;    
};


/**
 * Internal DSL method to clearify the purpose of the Virus.
 * This method keep track of the network using an attribute.
 * 
 * @param  {Network} network 
 * @return self
 */
Virus.prototype.within = function(network){
    this.targetNetwork = network;    
    return this;
};



/**
 * ------------------------------------------
 * Network
 * ------------------------------------------
 */
var Network = function(N, L, E){
    
    this.nodes    = null;
    this.gateways = null;
    
    [this.N, this.L, this.E] = [N, L, E];
    
    this.setupNodes();
    this.setupLinks();
    this.setupGateways();
};

// Setup Links using user initial data.
Network.prototype.setupLinks = function(){
    for (let i = 0; i < this.L; i++) {
        let [N1, N2] = readline().split(' '); 
        this.nodeAt(parseInt(N1)).linkTo(parseInt(N2));
    }
};


// Setup Nodes using user initial data.
Network.prototype.setupNodes = function(){
    this.nodes = [];
    
    for (let i = 0; i < this.N; i++) {
        this.nodes.push(new NetworkNode(i));
    }
};

// Setup Gateways using user initial data.
Network.prototype.setupGateways = function(){
    this.gateways = [];
    
    for (let i = 0; i < this.E; i++) {
        let EI = parseInt(readline()); 
        this.gateways.push(EI);
    }
};



/**
 * Return the NetworkNode object from a node ID
 * 
 * @param  {Integer} nodeId 
 * @return {NetworkNode} node of id : nodeId
 */
Network.prototype.nodeAt = function(nodeId){
    return this.nodes[nodeId];
};
Network.prototype.gatewayAt = function(nodeId){   
    if (this.hasGateway(nodeId)) {
        return this.nodeAt(nodeId);
    }
    return //undefined
};

/**
 * Check if the given node represent a network Gateway.
 * 
 * @param  {Integer} nodeId 
 * @return {Boolean}
 */
Network.prototype.hasGateway = function(nodeId){
    for (let i=0; i<this.gateways.length; i++) {
        if (nodeId == this.gateways[i]) {
            return true;   
        }
    }
    
    return false;
};

/**
 * ------------------------------------------
 * Game
 * ------------------------------------------
 */
var Game = function(){
    [this.N, this.L, this.E] = readline().split(' ');
};

/**
 * Launch the game. (game loop)
 */
Game.prototype.start = function(){
    let skynetAgent = new Agent();
    let virus       = new Virus();
    let network     = new Network(this.N, this.L, this.E);
    
    while (true) {
        virus.infects(network)
             .blocks(skynetAgent.moving());
    }
};



//////////
var game = new Game();
game.start();

