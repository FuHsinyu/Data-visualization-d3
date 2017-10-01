var myButton = document.querySelector("#changeQ");
var myButton2 = document.querySelector("#sortQ"); //buttons
var randomQuoteId;
var randomQuote;
var tmp;
var tmpQuote;
var quoteId = new Array(8);
var quote = new Array(8);
//Change the Quote of the Day randomly
myButton.onclick = function() {
	 var myQuote;
  myQuote = document.getElementById("quote0");	
	//myQuote.textContent = "Lannisters Always pay their debts. - House Stark of Lanister";
  randomNum = Math.floor(Math.random() * 10)%7;  
  randomQuoteId = "quote"+randomNum;
  randomQuote = document.getElementById(randomQuoteId);  
  //alert(randomQuote);
  tmp=myQuote.textContent;
  quote0.textContent = randomQuote.textContent ;
  randomQuote.textContent = tmp;
  //alert(randomQuote.textContent.length)
}
//Sort the quotes from less letters to more letters.
myButton2.onclick = function() {	 
  for (i=1;i<8;i++){
    quoteId[i] = "quote"+i;   
    quote[i]=document.getElementById(quoteId[i])//.textContent 
    //alert(quote[i].length)
   }
  //Bubble sort
  for (j=1;j<7;j++){
    for (i=1;i<7;i++){
    if(quote[i].textContent.length > quote[i+1].textContent.length)
      {    tmp = quote[i+1].textContent;
          quote[i+1].innerHTML = quote[i].textContent;
          quote[i].innerHTML= tmp;   
      }
    }
  }
}
    