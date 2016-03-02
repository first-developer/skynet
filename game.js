/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var NetworkNode = function(id){
    this.id   = null;
    this.next = [];
};
NetworkNode.prototype.linkTo = function(nodeId){
    this.next.push(nodeId);    
};
NetworkNode.prototype.isLinkedTo = function(node){
    let linked = this.next.find((n) => { return n === node.id });    
    return (linked !== undefined);
};
 
 

var Agent = function(){};
Agent.prototype.moving = function(){
    return parseInt(readline());
}


var Virus = function(){
    this.targetNetwork = null;
};
Virus.prototype.infects = function(network){
   this.targetNetwork = network;
}
Virus.prototype.brokeLinkBetween = function(N1, N2) {
    print([N1, N2].join(' '));
}
Virus.prototype.brokeLinkOrTryTheOtherWay = function(node1, node2) {
    if ( node1.isLinkedTo(node2) ) {
        this.brokeLinkBetween(node1, node2);       
    } else {
        if ( node2.isLinkedTo(node1) ) {
            this.brokeLinkBetween(node2, node1);       
        }
    }
}
Virus.prototype.blocks = function(agentPosition){
    let i;
    let network = this.targetNetwork;
    if ( !network ) {
        throw "NotNetworkFoundError: You need to infects a network first."       
    } 
    printErr(JSON.stringify(network));
    let nextAgentEventualMoves = network.nodeAt(agentPosition).next;
    for (i=0; i<nextAgentEventualMoves.length; i++) {
        let n = nextAgentEventualMoves[i];
        
        let gate = network.gatewayAt(n);
        if (gate) { // A gateway is found inside first neighbours
            this.brokeLinkBetween(agentPosition, gate);
            break;
        } else {
            // remove all links between the node and any existing gateway
            for (i=0; i<network.gateways.length; i++) {
                let g     = network.gateways[i];
                let nNode = network.nodeAt(n); // node at indice 'n'
                let gNode = network.nodeAt(g); // node at indice 'g'
                
                this.brokeLinkOrTryTheOtherWay(nNode, gNode);
            }
        }
    }
    
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
        this.nodeAt(N1).linkTo(N2);
    }
};
Network.prototype.nodeAt = function(id){
    return this.nodes[id];
};
Network.prototype.gatewayAt = function(position){
    return this.gateways.find((id) => { return id === position; });    
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
    
    virus.infects(network); 
    
    while (true) {
        virus.within(network).blocks(skynetAgent.moving());
    }
};



//////////
var game = new Game();
game.start();

