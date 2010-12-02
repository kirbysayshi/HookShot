HookShot
========

This is a simple linked list, implemented in JS. At it's core is an object called a Link, which is simply the wrapper for the actual data. The HookShot has an internal pointer that can be reset().

The code is documented well enough... but here's what you can do to a HookShot:

* iteration: next(), reset(), forEach(), where()
* mutation: detachCurrent(), join(), select()
* transformation: flatten(), clone()
* query: select(), where()

Usage:

	var l = new HookShot('a')
		.push('b')
		.push('c')
		.push('d')
		.push('e');
		
	var w = l.where(function(value, idx){
		if(value == 'c' || value == 'e') return true;
	});
	
	// w contains two links, with values of 'c' and 'e'
	// l remains unchanged
		
	var s = l.select(function(value, idx){
		if(value == 'c') return true;
	});
	
	// s contains 1 link, with value of 'c'
	// l now contains only 4 links
	
	var a = l.flatten();
	// a is now a simple array of the ordered values from s
	// ['a', 'b', 'd', 'e']
	// l is unchanged
	
	l.forEach(function(val, idx){
		console.log(val);
	});
	// logs: 'a', 'b', 'd', 'e'