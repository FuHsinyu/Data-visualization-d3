var myButton = document.querySelector("#changeQ");

myButton.onclick = function() {
	var myQuote = document.querySelector("div");	
	myQuote.textContent = "Lannisters Always pay their debts. - Tyrion";

}
var myButton = document.querySelector("#changeQ");

var myButton2 = document.querySelector("#sortQ");
myButton2.onclick = function() {	
	var node=document.getElementById("2");
	var list=document.getElementById("1");
	list.insertBefore(node,list.childNodes[0]);
}