var clickList = new Array();
var timeStamps = new Array();
var finalList = new Array();
var urlList = new Array();
var numOfClicks = 0;
var cliekdType = '';
var word = '';
var typing = 0;
// var cut = 0;

chrome.storage.local.get('discovery_num', function(result){
	if(result.discovery_num != null) {
	    numOfClicks += result.discovery_num;
	}
});
chrome.storage.local.get('discovery_loc', function(result){
	if(result.discovery_loc != null) {
    	clickList = result.discovery_loc;
	}
});
chrome.storage.local.get('discovery_type', function(result){
  if(result.discovery_type != null) {
      typing = result.discovery_type;
  }
});
chrome.storage.local.get('discovery_time', function(result){
  if(result.discovery_time != null) {
      timeStamps = result.discovery_time;
  }
});
chrome.storage.local.get('discovery_url', function(result){
  if(result.discovery_url != null) {
      urlList = result.discovery_url;
  }
});


function clickOrigin(e){
    var target = e.target;
    var tag = [];
    tag.tagType = target.tagName.toLowerCase();
    return tag;
}

document.onclick = clickListener;
document.onkeypress = keyListener;

function keyListener(e) {
	var charType = e.key;
	if(clickList[clickList.length-1] == ('User Input')) {
		word += String(e.key);
	}
}

function clickListener(e) {
  var clickedElement;
  // cut = 0;
  clickedType = clickOrigin(e).tagType;
  numOfClicks++;
  if(clickList[clickList.length-1] == ('User Input') && word != '') {
  	clickList.push('Typed: ' + word);
    timeStamps.push(Date.now());
    urlList.push(window.location.toString());
   	word = '';
  }
  if(typing == 1 && clickList.length > 0) {
    word = "Typed: " + document.getElementById(clickList[clickList.length-1]).value
    clickList[clickList.length-1] = word;
    typing = 0;
  }
  // if(clickedType == "div" || clickedType == "td" || clickedType == "span") {
  //   if(e.target.innerHTML!="Upload" && e.target.innerHTML!="File" && e.target.innerHTML!="Edit" && e.target.innerHTML!="Download" && e.target.innerHTML!="Share" && e.target.innerHTML!="Metadata" && e.target.innerHTML!="Refresh" && e.target.innerHTML!="Trash"){
  //     firstTable(e.target); 
  //   }    
  // }
  clickedElement = e.target.innerText;
  if(e.target.innerText.includes('The Discovery Environment integrates')) {
    clickedElement = "misclick";
  }
  if(clickedType == 'input') {
    clickedElement = e.target.value;
    if(e.target.type == 'text') {
      if(e.target.placeholder == "Enter a value") {
        clickList.push(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.innerText);
        timeStamps.push(Date.now());
        urlList.push(window.location.toString());
      }
      else {
        clickList.push(e.target.placeholder);
        timeStamps.push(Date.now());
        urlList.push(window.location.toString());
      }
      clickedElement = e.target.id;
      // cut = 1;
      typing = 1;
    }
  }
  if(clickedType == 'img') {
    clickedElement = e.target.alt;
  }
  if(clickedType == 'li') {
    clickedElement = e.target.id;
  }
  if(clickedType == 'textarea') {
    if(e.target.parentNode != null && e.target.parentNode.parentNode != null && e.target.parentNode.parentNode.parentNode != null) {
        word = e.target.parentNode.parentNode.parentNode.previousSibling.innerText;
    }
    clickList.push(word);
    timeStamps.push(Date.now());
    urlList.push(window.location.toString());
    clickedElement = e.target.id;
    typing = 1;
    // cut = 1;
  }
  // if(cut == 0 && clickedElement.length > 20) {
  //   clickedElement = clickedElement.substring(0,10);
  // }
	clickList.push(clickedElement);
  timeStamps.push(Date.now());
  urlList.push(window.location.toString());
  //alert(clickList);
  //alert(clickedElement);
	//alert(numOfClicks + ': ' + clickList);
	chrome.storage.local.set({ 'discovery_num': numOfClicks }, function(){
	});
	chrome.storage.local.set({ 'discovery_loc': clickList }, function(){
	});
  chrome.storage.local.set({ 'discovery_type': typing }, function(){
  });
  chrome.storage.local.set({ 'discovery_time': timeStamps }, function() {
  });
    chrome.storage.local.set({ 'discovery_url': urlList }, function(){
  });


  if(clickList.length == timeStamps.length) {
    finalList = new Array();
    var i;
    for (i = 0; i < clickList.length; i++) {
      var str1 = '[' + timeStamps[i] + ',' + clickList[i] + ',' + urlList[i] + ']';
      finalList.push(str1);
    }
  }
  else {
    alert(clickList.length);
    alert(timeStamps.length);
    alert("Error");
  }


  chrome.storage.local.set({ 'discovery_list': finalList }, function(){
  });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if((msg.from === 'popup')) {
    chrome.runtime.sendMessage();
  }
});


function typeOfElement(e) {

   	if(clickedType == 'b') {
   		clickedElement = 'Log Out';
   	}

    else {
    	//alert(String(e.target));
    	clickedElement = e.target;
    }

    return clickedElement;
}

  // function firstTable(e) {
  //   if(e.cellIndex == 1 || e.parentNode.cellIndex == 1 || e.parentNode.parentNode.cellIndex == 1) {
  //     alert("hi");
  //   }
  //   else if(e.cellIndex != null) {
  //     alert(e.innerText + " / " + e.parentNode.cells[1].innerText);
  //   }
  //   else if(e.parentNode.cellIndex != null) {
  //     alert(e.innerText + " / " + e.parentNode.parentNode.cells[1].innerText);
  //   }
  //   else if(e.parentNode.parentNode.cellIndex != null) {
  //     alert(e.innerText + " / " + e.parentNode.parentNode.parentNode.cells[1].innerText);
  //   }
  //   else {
  //     alert(e.innerText)
  //   }
  //}