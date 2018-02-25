/**
	This class abstracts away the differences between Pointer Lock API
	implementations across browsers. (Currently Chrome 23+ and Firefox 14+)
**/

var mouseMoveCallbackWrapper = function(callback) {
	return function(e) {
		let a: any = {
			movementX: e.movementX		||
					e.mozMovementX	||
					e.webkitMovementX,
			movementY: e.movementY		||
						e.mozMovementY	||
						e.webkitMovementY
		};

		return callback(a);
	};
};

export const PointerLock = {
	requestPointerLock: function(elem) {
		var _requestPointerLock =
			elem.requestPointerLock		||
			elem.mozRequestPointerLock	||
			elem.webkitRequestPointerLock;
		if(!!_requestPointerLock) {
			_requestPointerLock.call(elem);
		}
	},

	pointerLockElement: function() {
		return document.pointerLockElement	||
			(document as any).mozPointerLockElement	||
			(document as any).webkitPointerLockElement;
	},

	addPointerLockExchangeEventListener: function(target, callback,
		useCapture) {

		target.addEventListener('pointerlockchange', callback,
			useCapture);
		target.addEventListener('mozpointerlockchange', callback,
			useCapture);
		target.addEventListener('webkitpointerlockchange', callback,
			useCapture);
	},

	addMouseMoveEventListener: function(target, callback, useCapture) {
		//Every function used as an argument to addMouseMoveEventListener
		//gets an assoc array mapping DOM elements to the wrapped function
		//which is used for the mousemove event.
		callback.__MouseLockWrapper = [] || callback.__MouseLockWrapper;
		callback.__MouseLockWrapper[target] = mouseMoveCallbackWrapper(callback);

		return target.addEventListener("mousemove", callback.__MouseLockWrapper[target], useCapture);
	},

	removeMouseMoveEventListener: function(target, callback) {
		var result = target.removeEventListener("mousemove",
			callback.__MouseLockWrapper[target]);

		//Delete the wrapper property element
		delete callback.__MouseLockWrapper[target];
		return result;
	}
};