function LinkedNode(obj){
    this.head;
    this.next;
    this.prev;
    this.obj = obj;
    console.log("NEW NODE: " + obj);
}

LinkedNode.prototype.length = 0;
LinkedNode.prototype.push = function(node){
    this.next = node;
    node.prev = this;
    if(!node.head){
        this.head = this;
    }
    node.head = this.head;
    length++;
    return this;
}
LinkedNode.prototype.pop = function(){
    var  prev = this.prev
        ,next = this.next;
    prev.next = next;
    next.prev = prev;
    return this.obj;
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