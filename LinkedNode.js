function LinkedNode(data, isHead){
    this.head;
    this.next;
    this.prev;
    this.data = data;
	if(isHead === true){ this.head = this; }
    console.log("NEW NODE: " + data);
}

LinkedNode.prototype.length = 0;
LinkedNode.prototype.push = function(node){
    this.next = node;
    node.prev = this;
    node.head = this.head;
    this.head.length++;
    return node;
}
LinkedNode.prototype.detach = function(){
    var  prev = this.prev
        ,next = this.next;
    prev.next = next;
    next.prev = prev;
	this.head.length--;
    return this.data;
}
LinkedNode.prototype.get = function(i){
    var current = this.head
        ,count = 0
        ,toCompare = ~~i;
    while(current && current != this){ 
        if(count === toCompare){
            return current;
        }
        count++;
        current = current.next;
    }
}
LinkedNode.prototype.each = function(callback){
    var current = this.head
        ,count = 0;
    while(current){       
        callback.call(current, count);
        count++;
        current = current.next;
    }
}
LinkedNode.prototype.asArray = function(){
    var current = this.head
		,arr = [];
    while(current){       
        arr.push(current.data);
        current = current.next;
    }
	return arr;
}

LN = LinkedNode;