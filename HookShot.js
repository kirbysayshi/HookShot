///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a new instance of a HookShot linked list. Each
 * element is a Link object, which wraps the actual value.
 *
 * @param  Object value required
 * @return	HookShot
 * @constructor
 */
function HookShot(value){
	this.head = new HookShot.prototype.Link(value, this);
	this.current = this.head;
	this.last = this.head;
	this.length = 1;
}
/**
 * Moves the internal pointer to the next element, and 
 * returns that element if there is one, or false if 
 * there is not.
 *
 * @return  Link/false   Link
 */
HookShot.prototype.next = function(){
	this.current = this.current.next;
	if(this.current == undefined){
		return false;
	} else {
		return this.current;
	}
}
/**
 * Resets the internal pointer to the first element
 * (Link) and returns that element.
 *
 * @return  void   the "head" Link
 */
HookShot.prototype.reset = function(){
	return this.current = this.head;
}
/**
 * Adds a new object (Link) to the end of the list, and 
 * returns the list.
 *
 * @param  Object value  the new object to add
 * @return  HookShot	this list
 */
HookShot.prototype.push = function(value){
	var link = new HookShot.prototype.Link(value, this);
	this.last.next = link;
	link.prev = this.last;
	this.last = link;
	this.length += 1;
	return this;
}
/**
 * Removes the last Link from the list and sets the internal
 * pointer, if necessary to the new last element of the list.
 *
 * @return  Link   the former last Link of the list
 */
HookShot.prototype.pop = function(){
	var last = this.last;
	last.prev.next = undefined;
	this.length -= 1;
	this.last = last.prev;
	if(this.current == last || this.current == undefined){
		this.current = this.last;
	}
	return last;
}
/**
 * Removes the Link that the internal pointer is currently
 * pointing at, and joins the surrounding links of necessary.
 * The Link's connection to its former previous and next peers
 * is left intact, but it's wielder is not.
 *
 * @return  Link   the former current Link
 */
HookShot.prototype.detachCurrent = function(){
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
/**
 * Can take a Link or HookShot and join it to the end of the
 * HookShot instance, efectively creating one list. The thing is 
 * actually cloned, so it is left intact. If a simple object is passed
 * in, it is just pushed onto the end of the list as a new Link.
 *
 * @param  HookShot/Link/Object thing  something to add onto the end of the list
 * @return  HookShot   the original list with the new additions
 */
HookShot.prototype.join = function(thing){
	if(thing instanceof HookShot.prototype.Link){
		var last = this.last;
		thing.prev = last;
		last.next = thing;
		this.last = thing;
		this.length += 1;
		return this;
	} else if(thing instanceof HookShot) {
		var el = thing.reset(), count = 0;
		while(el){
			this.push(el.value);
			count += 1;
			el = thing.next();
		}
	} else {
		this.push(thing);
		return this;
	}
}
/**
 * Resets the internal pointer, and iterates through each element
 * of the list, calling the callback for each element. The callback is 
 * passed two parameters, the "value" of each link, and the count of the 
 * current link. "this" inside the callback is the Link itself.
 *
 * @param  Function callback  the function to call on each Link
 * @return  HookShot   this list
 */
HookShot.prototype.forEach = function(callback){	
	var el = this.reset(), count = 0;
	while(el){
		if(callback.call(el, el.value, count) === false){
			break;
		}
		count += 1;
		el = this.next();
	}
	return this;
}
/**
 * Converts the list to an array. The original list is left 
 * untouched.
 *
 * @return  Array   The flattened list as an array
 */
HookShot.prototype.flatten = function(){
	var arr = [], el = this.reset();
	while(el){
		arr.push(el.value);
		el = this.next();
	}
	return arr;
}
/**
 * Gets the value of the Link at the given index.
 *
 * @param  integer i  The index of the value to retrieve
 * @return  mixed/HookShot   whatever the value is, or the list if the index is invalid
 */
HookShot.prototype.getAt = function(i){  
	var  el = this.reset()
        ,count = 0
        ,toCompare = ~~i;
	
    while(el){ 
        if(count === toCompare){
			this.reset();
            return el.value;
        }
		el = this.next();
        count++;
    }
    return this;
}
/**
 * Creates a new HookShot from another. Depending on the target value,
 * the new HookShot's Links may just be references to the target value.
 * i.e., this does not do a deep clone.
 *
 * @return  HookShot   the new list
 */
HookShot.prototype.clone = function(){
	var el = this.reset(), clone;
	while(el){
		if(clone == undefined){
			clone = new HookShot(el.value);
		} else {
			clone.push(el.value);
		}
		el = this.next();
	}
	return clone;
}
/**
 * Creates a new list from an existing one by iterating and filtering 
 * elements. If the callback returns true, the element is added to a 
 * new list. If false, the element is not added. The original list is
 * left untouched. 
 *
 * @param  Function conditionalCallback  the function to test each element
 * @return  HookShot   the new list of qualifying Links
 */
HookShot.prototype.where = function(conditionalCallback){
	var el = this.reset(), count = 0, news;
	while(el){
		if(conditionalCallback.call(el, el.value, count) === true){
			if(news == undefined){
				news = new HookShot(el.value);
			} else {
				news.push(el.value)
			}
		}
		count += 1;
		el = this.next();
	}
	return news;
}
/**
 * Same as where, but mutates the original list by removing Links
 * that match the condition and placing them into a new list.
 *
 * @param  Function conditionalCallback  the function to test each element
 * @return  HookShot   the new list of qualifying Links
 */
HookShot.prototype.select = function(conditionalCallback){
	var el = this.reset(), count = 0, news;
	while(el){
		if(conditionalCallback.call(el, el.value, count) === true){
			if(news == undefined){
				news = new HookShot(el.value);
			} else {
				news.push(el.value)
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

/**
 * Mostly used internally, this is used as a wrapper for each element of
 * a HookShot, which is accessed by its value property.
 *
 * @param  Object value  the value this link should hold
 * @param  HookShot  wielder  the parent list of this link
 * @return  void   
 */
HookShot.prototype.Link = function(value, wielder){
	this.next;
    this.prev;
    this.value = value;
	this.wielder = wielder;
}