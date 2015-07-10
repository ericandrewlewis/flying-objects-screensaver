// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// MIT license
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
		                           || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

var Screensaver = function(dataURI) {
	// Create an image element to access the image's width and height.
	var img = this.img = new Image;
	img.src = dataURI;
	this.animating = true;
	// Add an <svg> element on the page.
	var svg = this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', '100%');
	svg.setAttribute('height', '100%');
	document.body.appendChild(svg);

	// If the image is too big, make the dimensions smaller.

	if ( img.height > window.innerHeight / 2.25 ) {
		var ratio = ( window.innerHeight / 2.25 ) / img.height;
		img.height *= ratio;
		img.width *= ratio;
	}
	if ( img.width > window.innerWidth / 3 ) {
		var ratio = ( window.innerWidth / 3 ) / img.width;
		img.height *= ratio;
		img.width *= ratio;
	}
	var imageEl = this.imageEl = document.createElementNS('http://www.w3.org/2000/svg', 'image');
	imageEl.setAttribute( 'x', '0' );
	imageEl.setAttribute( 'y', '0' );
	imageEl.setAttribute( 'height', img.height );
	imageEl.setAttribute( 'width', img.width );
	imageEl.setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', dataURI );
	svg.appendChild(imageEl);
	this.imageVelocity = {
		x: 2,
		y: 2
	};

	this.animate();
}

Screensaver.prototype.draw = function(time) {
	var currentX = parseInt( this.imageEl.getAttribute( 'x' ) );
	var currentY = parseInt( this.imageEl.getAttribute( 'y' ) );
	if ( currentX < 0 || currentX + this.img.width > window.innerWidth ) {
		this.imageVelocity.x *= -1;
	}
	if ( currentY < 0 || currentY + this.img.height > window.innerHeight ) {
		this.imageVelocity.y *= -1;
	}
	this.imageEl.setAttribute( 'y', currentY + this.imageVelocity.y );
	this.imageEl.setAttribute( 'x', currentX + this.imageVelocity.x );
}

Screensaver.prototype.animate = function() {
	if ( this.animating ) {
		requestAnimationFrame( this.animate.bind( this ) );
		this.draw();
	}
}

Screensaver.prototype.destroy = function() {
	this.animating = false;
	document.body.removeChild( this.svg );
}

document.addEventListener('DOMContentLoaded', function(event) {

	var defaultScreensaver = new Screensaver('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QEORXhpZgAATU0AKgAAAAgACAEGAAMAAAABAAIAAAESAAMAAAABAAEAAAEaAAUAAAABAAAAbgEbAAUAAAABAAAAdgEoAAMAAAABAAIAAAExAAIAAAAeAAAAfgEyAAIAAAAUAAAAnIdpAAQAAAABAAAAsAAAAAAAARlJAAAD6AABGUkAAAPoQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2gAMjAxMTowMjowMiAyMTo1NzoxNQAABZAAAAcAAAAEMDIyMZAEAAIAAAAUAAAA8qABAAMAAAAB//8AAKACAAQAAAABAAAAYKADAAQAAAABAAAAbQAAAAAyMDExOjAyOjAyIDIxOjI5OjI4AP/hFXxodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpjcnM9Imh0dHA6Ly9ucy5hZG9iZS5jb20vY2FtZXJhLXJhdy1zZXR0aW5ncy8xLjAvIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI5RjM3QzgyMDkyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjAxODAxMTc0MDcyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MDE4MDExNzQwNzIwNjgxMTg1REE4QTVGNDNFRTRFOTMiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRpc3BsYXkiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcDpDcmVhdGVEYXRlPSIyMDExLTAyLTAyVDIxOjI5OjI4WiIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxMS0wMi0wMlQyMTo1NzoxNVoiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcDpNb2RpZnlEYXRlPSIyMDExLTAyLTAyVDIxOjU3OjE1WiIgY3JzOkFscmVhZHlBcHBsaWVkPSJUcnVlIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIgc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowNzgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowMTgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHN0RXZ0OndoZW49IjIwMTEtMDItMDJUMjE6Mjk6MjhaIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxODAxMTc0MDcyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiBzdEV2dDphY3Rpb249ImNyZWF0ZWQiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9wbmcgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDp3aGVuPSIyMDExLTAyLTAyVDIxOjQxOjM0WiIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIgc3RFdnQ6YWN0aW9uPSJzYXZlZCIvPiA8cmRmOmxpIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDp3aGVuPSIyMDExLTAyLTAyVDIxOjQyOjIxWiIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIgc3RFdnQ6YWN0aW9uPSJzYXZlZCIvPiA8cmRmOmxpIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDp3aGVuPSIyMDExLTAyLTAyVDIxOjQzOjA3WiIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNDgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIgc3RFdnQ6YWN0aW9uPSJzYXZlZCIvPiA8cmRmOmxpIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiBzdEV2dDpjaGFuZ2VkPSIvIiBzdEV2dDp3aGVuPSIyMDExLTAyLTAyVDIxOjU1OjI0WiIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNzgwMTE3NDA3MjA2ODExODVEQThBNUY0M0VFNEU5MyIgc3RFdnQ6YWN0aW9uPSJzYXZlZCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+IDxyZGY6bGkgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHN0RXZ0OmNoYW5nZWQ9Ii8iIHN0RXZ0OndoZW49IjIwMTEtMDItMDJUMjE6NTU6MjRaIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA4ODAxMTc0MDcyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiBzdEV2dDphY3Rpb249InNhdmVkIi8+IDxyZGY6bGkgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHN0RXZ0OmNoYW5nZWQ9Ii8iIHN0RXZ0OndoZW49IjIwMTEtMDItMDJUMjE6NTY6NDVaIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkI3RjM3QzgyMDkyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiBzdEV2dDphY3Rpb249InNhdmVkIi8+IDxyZGY6bGkgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHN0RXZ0OmNoYW5nZWQ9Ii8iIHN0RXZ0OndoZW49IjIwMTEtMDItMDJUMjE6NTc6MTVaIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkI4RjM3QzgyMDkyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiBzdEV2dDphY3Rpb249InNhdmVkIi8+IDxyZGY6bGkgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHN0RXZ0OmNoYW5nZWQ9Ii8iIHN0RXZ0OndoZW49IjIwMTEtMDItMDJUMjE6NTc6MTVaIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkI5RjM3QzgyMDkyMDY4MTE4NURBOEE1RjQzRUU0RTkzIiBzdEV2dDphY3Rpb249InNhdmVkIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tAGRQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAALBwBWgADGyVHHAIAAAIAAhwCPgAIMjAxMTAyMDIcAj8ACzIxMjkyOCswMDAwOEJJTQQlAAAAAAAQTHxGfmqR25fTagqF3e1JJv/iF9xJQ0NfUFJPRklMRQABAQAAF8xhcHBsAhAAAG1udHJSR0IgWFlaIAfbAAEAAQARABMAOWFjc3BBUFBMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtYXBwbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWRlc2MAAAFQAAAAYmRzY20AAAG0AAAAJGNwcnQAAAHYAAAA0Hd0cHQAAAKoAAAAFHJYWVoAAAK8AAAAFGdYWVoAAALQAAAAFGJYWVoAAALkAAAAFHJUUkMAAAL4AAAIDGFhcmcAAAsEAAAAIHZjZ3QAAAskAAAGEm5kaW4AABE4AAAGPmNoYWQAABd4AAAALG1tb2QAABekAAAAKGJUUkMAAAL4AAAIDGdUUkMAAAL4AAAIDGFhYmcAAAsEAAAAIGFhZ2cAAAsEAAAAIGRlc2MAAAAAAAAACERpc3BsYXkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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');
	// Listen for a file to be uploaded.
	var inputEl = document.querySelector('input');
	document.querySelector('input').addEventListener('change', function() {
		// When a file is uploaded, initialize
		var file = inputEl.files[0];
		var reader = new FileReader();
		reader.onloadend = function () {
			document.body.removeChild( document.querySelector('.input-wrapper') );
			document.body.style.cursor = 'none';
			defaultScreensaver.destroy();
			new Screensaver(reader.result);

		}
		reader.readAsDataURL(file);
	});
	return;
});