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
Virus.prototype.block = function(agentPosition){
    let i;
    let network = this.targetNetwork;
    if ( !network ) {
        throw "NotNetworkFoundError: You need to infects a network first."       
    } 
    
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
                
                if ( nNode.isLinkedTo(gNode) ) {
                    this.brokeLinkBetween(nNode, gNode);       
                } else {
                    if ( gNode.isLinkedTo(nNode) ) {
                        this.brokeLinkBetween(gNode, nNode);       
                    }
                }
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
    this.setupLinks();
    this.setupNodes();
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
Network.prototype.gatewayAt(position){
    return this.gateways.find((id) => { return id === pos; });    
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
        this.gateways.add(EI);
    }
};


var Game = function(){
    [this.N, this.L, this.E] = readline().split(' ');
};
Game.prototype.start = function(){
    let skynetAgent = new Agent();
    let virus       = new Virus();
    let network     = new Network();
    
    virus.infects(network); 
    
    while (true) {
        virus.within(network).block(skynetAgent.moving());
    }
};



//////////
var game = new Game();
game.start();

