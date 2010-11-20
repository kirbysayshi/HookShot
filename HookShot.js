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

////////////////////////////////////////////////////////////

function LongShot(data){
	this.head = new LongShot.prototype.Link(data, this);
	this.current = this.head;
	this.last = this.head;
	//this.head.next = this.head;
	//this.head.prev = this.head;
	this.length = 1;
}
LongShot.prototype.next = function(){
	this.current = this.current.next;
	if(this.current == undefined){
		return false;
	} else {
		return this.current;
	}
}
LongShot.prototype.reset = function(){
	return this.current = this.head;
}
LongShot.prototype.push = function(data){
	var link = new LongShot.prototype.Link(data, this);
	this.last.next = link;
	link.prev = this.last;
	this.last = link;
	this.length += 1;
	return this;
}
LongShot.prototype.pop = function(){
	var last = this.last;
	last.prev.next = undefined;
	this.length -= 1;
	this.last = last.prev;
	if(this.current == last || this.current == undefined){
		this.current = this.last;
	}
	return last;
}
LongShot.prototype.detachCurrent = function(){
	var l = this.current,
		p = l.prev,
		n = l.next;
	
	if(l == this.head){
		this.head = n;
		n.prev = undefined;
		this.current = this.head;
	} else if (l == this.last){
		p.next = undefined;
		this.current = p;
		this.last = p;
	} else {
		p.next = n;
		n.prev = p;		
		this.current = n;
	}

	l.wielder = undefined;
	this.length -= 1;	
	return l;
}
LongShot.prototype.join = function(thing){
	if(thing instanceof LongShot.prototype.Link){
		var last = this.last;
		thing.prev = last;
		last.next = thing;
		this.last = thing;
		this.length += 1;
		return this;
	} else if(thing instanceof LongShot) {
		var el = thing.reset(), count = 0;
		while(el){
			this.push(el.data);
			count += 1;
			el = thing.next();
		}
	} else {
		this.push(thing);
		return this;
	}
}
LongShot.prototype.forEach = function(callback){	
	var el = this.reset(), count = 0;
	while(el){
		if(callback.call(el, el.data, count) === false){
			break;
		}
		count += 1;
		el = this.next();
	}
	return this;
}
LongShot.prototype.flatten = function(){
	var arr = [], el = this.reset();
	while(el){
		arr.push(el.data);
		el = this.next();
	}
	return arr;
}
LongShot.prototype.getAt = function(i){  
	var  el = this.reset()
        ,count = 0
        ,toCompare = ~~i;
	
    while(el){ 
        if(count === toCompare){
			this.reset();
            return el.data;
        }
		el = this.next();
        count++;
    }
    return this;
}
LongShot.prototype.clone = function(){
	var el = this.reset(), clone;
	while(el){
		if(clone == undefined){
			clone = new LongShot(el.data);
		} else {
			clone.push(el.data);
		}
		el = this.next();
	}
	return clone;
}
LongShot.prototype.where = function(conditionalCallback){
	var el = this.reset(), count = 0, news;
	while(el){
		if(conditionalCallback.call(el, el.data, count) === true){
			if(news == undefined){
				news = new LongShot(el.data);
			} else {
				news.push(el.data)
			}
		}
		count += 1;
		el = this.next();
	}
	return news;
}
LongShot.prototype.select = function(conditionalCallback){
	var el = this.reset(), count = 0, news;
	while(el){
		if(conditionalCallback.call(el, el.data, count) === true){
			if(news == undefined){
				news = new LongShot(el.data);
			} else {
				news.push(el.data)
			}
			this.detachCurrent();
			el = this.current;
		} else {
			el = this.next();
		}
		count += 1;
	}
	return news;
}

LongShot.prototype.Link = function(data, wielder){
	this.next;
    this.prev;
    this.data = data;
	this.wielder = wielder;
}