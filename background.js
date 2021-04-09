var MyArray = new Array();

// record the timestamp and the URL at an interval
var myVar = setInterval(record, 5000);

function record() {
    var d = new Date();
    var link;

    chrome.tabs.query({active: true, lastFocusedWindow: true},function(tabs) {
        MyArray.push(tabs[0].url);
        let url = tabs[0].url;
        link = url;
    });

    MyArray.push(d);
    // MyArray.push(url);

}

// upon receiving the message from popup.js, download the JSON of the array
chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
    if (request.message == "URL"){
        // blob code from SO
        var _myArray = JSON.stringify(MyArray , null, 4); 
        var vLink = document.createElement('a'),
        vBlob = new Blob([_myArray], {type: "octet/stream"}),
        vName = 'url-tracks.json',
        vUrl = window.URL.createObjectURL(vBlob);
        vLink.setAttribute('href', vUrl);
        vLink.setAttribute('download', vName );
        vLink.click();
    } else if (request.message == "Discovery") {
      chrome.storage.local.get('discovery_list', function(result){
        if(result.discovery_list != null) {
            chrome.downloads.download({
                    url: "data:text/plain," + result.discovery_list,
                    filename: "discovery.txt",
                    conflictAction: "overwrite", 
                    saveAs: false,
                });
        }
      });
    } else if (request.message == "Subway") {
      chrome.storage.local.get('subway_list', function(result){
        if(result.subway_list != null) {
          var data = "";
          for (var i = 0; i < result.subway_list.length; i++) {
                data += result.subway_list[i] + ",\n";
          }
          data = data.replace(/#/g, "%23");          
          chrome.downloads.download({
                url: "data:text/plain," + data,
                filename: "subway.txt",
                conflictAction: "overwrite", 
                saveAs: false,
          });
        }
      });
    }
});
