/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

var NetworkNode = function(id){
    this.id   = null;
    this.next = [];
};
NetworkNode.prototype.linkTo = function(node){
    this.next.push(node);    
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
Virus.prototype.block = function(agentPosition){
    let network = this.targetNetwork;
    if ( !network ) {
        throw "NotNetworkFoundError: You need to infects a network first."       
    } 
    
    let nextAgentEventualMoves = network.nodeAt(agentPosition).next;
    nextAgentEventualMoves.forEach((x) => {
        //let gate = network.gatewayAt(x)
        //if 
    });
    
    
    
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
    return this.gateways.find((id) => { id == pos });    
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

