/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var d = function(...any){
    printErr(JSON.stringify(any));    
}


var NetworkNode = function(id){
    this.id   = id;
    this.next = [];
};
NetworkNode.prototype.linkTo = function(nodeId){
    this.next.push(nodeId);    
};
NetworkNode.prototype.isLinkedTo = function(node){
    for (let i=0; i<this.next.length; i++) {
        let nextNode = this.next[i];
        if (node.id == nextNode) {
            return true;   
        }
    }
    
    return false;
};
 
 

var Agent = function(){};
Agent.prototype.moving = function(){
    return parseInt(readline());
}


var Virus = function(){
    this.targetNetwork       = null;
    this.currentAgentPosition = null;
};
Virus.prototype.infects = function(network){
   this.targetNetwork = network;
   return this;
}
Virus.prototype.brokeLinkBetween = function(N1, N2) {
    print([N1, N2].join(' '));
}
Virus.prototype.brokeLinkOrTryTheOtherWay = function(node1, node2) {
    if ( node1.isLinkedTo(node2) ) {
        this.brokeLinkBetween(node1.id, node2.id);       
    } else {
        if ( node2.isLinkedTo(node1) ) {
            this.brokeLinkBetween(node2.id, node1.id);       
        }
    }
}
Virus.prototype.recursiveBreak = function(rest) {
    let network = this.targetNetwork;
    
    if (!rest.length) {
        return    
    } else {
        let n = rest.shift();  
        let nNode = network.nodeAt(n); // node at indice 'n'
        
        if ( network.hasGateway(n) ) { // A gateway is found inside first neighbours
            this.brokeLinkBetween(this.currentAgentPosition, n);
        } else {
            // remove all links between the node and any existing gateway
            for (i=0; i<network.gateways.length; i++) { 
                let g     = network.gateways[i];
    
                let gNode = network.nodeAt(g);   // node at indice 'g'
                
                
                this.brokeLinkOrTryTheOtherWay(nNode, gNode);
            }
        }
        
        this.recursiveBreak(rest);
        this.recursiveBreak(nNode.next);
    }
};

Virus.prototype.blocks = function(agentPosition){
    let i;
    let network = this.targetNetwork;
    this.currentAgentPosition = agentPosition;

    if ( !network ) {
        throw "NotNetworkFoundError: You need to infects a network first."       
    } 

    d("currentAgentPosition", this.currentAgentPosition);

    let nextAgentEventualMoves = network.nodeAt(this.currentAgentPosition).next.sort();
    
    this.recursiveBreak(nextAgentEventualMoves);
    
    return this;    
};
Virus.prototype.within = function(network){
    this.targetNetwork = network;    
    return this;
};


var Network = function(N, L, E){
    
    this.nodes    = null;
    this.gateways = null;
    
    [this.N, this.L, this.E] = [N, L, E];
    
    this.setupNodes();
    this.setupLinks();
    this.setupGateways();
};
Network.prototype.setupLinks = function(){
    for (let i = 0; i < this.L; i++) {
        let [N1, N2] = readline().split(' '); 
        this.nodeAt(parseInt(N1)).linkTo(parseInt(N2));
    }
};
Network.prototype.nodeAt = function(nodeId){
    return this.nodes[nodeId];
};
Network.prototype.gatewayAt = function(nodeId){   
    if (this.hasGateway(nodeId)) {
        return this.nodeAt(nodeId);
    }
    return //undefined
};
Network.prototype.hasGateway = function(nodeId){
    for (let i=0; i<this.gateways.length; i++) {
        if (nodeId == this.gateways[i]) {
            return true;   
        }
    }
    
    return false;
};

Network.prototype.setupNodes = function(){
    this.nodes = [];
    
    for (let i = 0; i < this.N; i++) {
        this.nodes.push(new NetworkNode(i));
    }
};
Network.prototype.setupGateways = function(){
    this.gateways = [];
    
    for (let i = 0; i < this.E; i++) {
        let EI = parseInt(readline()); 
        this.gateways.push(EI);
    }
};


var Game = function(){
    [this.N, this.L, this.E] = readline().split(' ');
};
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

