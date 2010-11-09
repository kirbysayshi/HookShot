function HookShot(data, isHead){
    this.head;
    this.next;
    this.prev;
    this.data = data;
	
	if(isHead === true || isHead == undefined){ 
		this.head = this; 
		this.length = 1;
	}
}

HookShot.prototype.length = function(){
	return this.head.length;
};
HookShot.prototype.push = function(data){
	var node = new HookShot(data, false);
    this.next = node;
    node.prev = this;
    node.head = this.head;
    this.head.length++;
    return node;
}
HookShot.prototype.link = function(link){
	this.next = link;
    link.prev = this;
    link.head = this.head;
    this.head.length++;
    return link;
}
HookShot.prototype.detach = function(){
    var  prev = this.prev
        ,next = this.next
		,length = this.head.length;
    
	// special case: reassign all the heads to the next in line...
	if(this.head == this && next != undefined){
		this.forEach(function(){
			this.head = next;
		});
	}
	
	if(prev != undefined && prev.next == this) { prev.next = next; }
	if(next != undefined && next.prev == this) { next.prev = prev; }
	this.head.length = length-1;
	
	// set head to this and return
	return this.head = this;
}
HookShot.prototype.get = function(i){
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
	return this;
}
HookShot.prototype.forEach = function(callback){
    var current = this.head
        ,count = 0;

    while(current){       
        if(callback.call(current, count) === false){
			break;
		}
        count++;
        current = current.next;
    }
	return this;
}
HookShot.prototype.clone = function(){
	var current = new HookShot(this.data);
	this.forEach(function(index){
		if(index > 0){
			current = current.push(this.data);
		}
	});
	return current;
}
HookShot.prototype.where = function(conditionCallback, mutate){
	var  news = []
		,newHook = new HookShot()
		,i = 0
		,l = 0;
	
	this.forEach(function(index){
		if( conditionCallback.call(this, index) === true ){
			if(mutate === false || mutate == undefined){
				news.push( this.data );
			} else {
				news.push( this.detach() );
			}
		}
	});
	
	if(news.length > 0){
		if(mutate === false || mutate == undefined){
			newHook = new HookShot(news[0]);
			for(i = 1, l = news.length; i < l; i++){
				newHook = newHook.push( news[i] );
			}
		} else {
			newHook = news[0];
			for(i = 1, l = news.length; i < l; i++){
				newHook = newHook.link( news[i] );
			}
		}
	}
	
	return newHook;
}
HookShot.prototype.flatten = function(){
    var current = this.head
		,arr = [];
    while(current){       
        arr.push(current.data);
        current = current.next;
    }
	return arr;
}

LN = HookShot;