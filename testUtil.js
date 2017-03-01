function output(txt) {
	document.getElementById("testArea").innerHTML += txt;
}

function assertEquals(expected,actual,errMsg) {
	errMsg = errMsg || "";
	if (expected !== actual) {
//		output(arguments.callee.caller.name + " failed. Expected '" + expected + "', was '"+actual+"': "+ errMsg + "\n");
		throw "\n\tExpected '" + expected + "', was '"+actual+"':\n\t"+ errMsg + "\n\n";
	}
}

function assertMoveEquals(expected, actual, errMsg) {
	errMsg = errMsg || "";
	
	if (expected != actual){
		throw "\n\tExpected move " + getMoveString(expected) + " but was " + getMoveString(actual) + ".\n\t" + errMsg + "\n\n";
	}
}

function getMoveString(move) {
	var files = "ABCDEFG";
	return files[getFileFrom(move)] + (getRankFrom(move)+1) + "-" + files[getFileTo(move)] + (getRankTo(move)+1);
}

function assertContains(element, array, errMsg){
	for (var i = 0; i < array.length; i++){
		if (array[i] === element) { return; }
	}
	throw "\n\tExpected '"+element+"' was in array.\n\t" + errMsg + "\n\n";
}

function assertNotContains(element, array, errMsg){
	for (var i = 0; i < array.length; i++) {
		if (array[i] === element) {
			throw "\n\tExpected '"+element+"' not in array.\n\t" + errMsg + "\n\n";
		}
	}
	return;
}

function emptyFunc() { }

function getBoard() {
	var b = new Board();
	b.setUpInitialPosition();
	b.redrawCallback = emptyFunc;
	return b;
}

var allTests = new Array();
function addTests(testArray) {
	allTests = allTests.concat(testArray);
}

(function () {
	var oldonload = window.onload;
	window.onload = function() {
		if (oldonload != undefined) { oldonload(); }
		var passedTests = 0;
		// run all tests
		for (var i = 0; i < allTests.length; i++) { 
			var funcName = "";
			try { 
				funcName = allTests[i].name;
				allTests[i]();
				++passedTests;
			} catch (e) {
				output(funcName + ": " + e);
			}
		}
		output("passed "+passedTests+"/"+allTests.length+" tests.\n");
	}
})();
