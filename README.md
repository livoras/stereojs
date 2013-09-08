StereoJS
==============================

## About

Stereo.js is a little library for communication between browser's tabs.

## Example
You can open `example/frame1.html` and `example/frame2.html`, 
then type some text in input of `frame1.html`, see the change of `frame2.html` at the same time.

**NOTE**: You need a server to make it work.

## Technical details
Using `localStorage Events` mechanism.
 
## Usage

### stereo.broadcast(EventName:String, Data:Object)
This API is used to tell other tabs that something has occured in this tab, and you can send data to other tabs at the same time.

	// frame1.html
	stereo.broadcast('todo', {
		content: 'To complete a Hello World program'
	})  

Tabs except this tab can catch this event by using `stereo.on` API.

**NOTE**: `Data` must be a plain JavaScript Object, and it doesn't accept function as value. Function context in one tab will not be transported to other tabs.

### stereo.on(EventName:String, callback:Function)

Listen to other page's changes. When other broadcast the event called `EventName`, then the callback function in this page will be executed. Data that added when other tabs broadcast event will be passed into callback function. In other words, you can get data from other tabs in callback function.

	// frame2.html
	stereo.on('todo', function (todo) {
		document.getElementById('heading2').innerHTML = todo.content // 'To complete a Hello World program'
	})

As shown above. Frame1 uses `stereo.broadcast` to trigger an event named  `todo`, and addon an object data. Frame2 listens to `todo` event by using `stereo.on` API. When frame1 broadcast a `todo` event, callback function in Frame2 will be executed, and you can get data sent by frame1 in callback function. 

### stereo.off(EventName:String, callback:Function)
The opposite of  `stereo.on`. You may want to stop listening to certain event, you can use this API.
	
	function addTodo() {
		document.getElementById('heading2').innerHTML = todo.content
	}
	
	stereo.on('todo', addTodo)

	// Something happens
	
	stereo.off('todo', addTodo)
	
	

## Compatibility
* IE 8+
* Firefox 3.0+
* Chrome 4.0+
* Other Browsers that support `localStorage` events 

## License
MIT
