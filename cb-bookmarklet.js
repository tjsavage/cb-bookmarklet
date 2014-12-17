getScript('https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',function(){ 
  runBookmarklet();
});

function runBookmarklet() {
    var data = getScrapedData();
    var csvData = arrayToCsv(data);
    window.prompt("Copy:", csvData);
}

function arrayToCsv(arr) {
    var csvData = "Date,URLs,Unpenalized URLs,Live SERP,Domains\n";
    for(var i = 0; i < arr.length; i++) {
        csvData =+ arr[i].join() + "\n";
    }
    return csvData;
}

function getScrapedData() {
    var data = [];
    $("#history tbody > tr[data-bind]").map(
        function(i, val) { 
            data.push(extractDataFromRow(val));
        }
    );
    return data;
}

function extractDataFromRow(row) {
    return {
        "date": row.children[0].textContent,
        "urls": row.children[1].children[0].textContent,
        "unpenalizedUrls": row.children[2].children[0].textContent,
        "liveSerp": row.children[3].textContent,
        "domains": row.children[4].textContent
    }
}

// getScript()
// more or less stolen form jquery core and adapted by paul irish

function getScript(url,success){

  var head = document.getElementsByTagName("head")[0], done = false;
  var script = document.createElement("script");
  script.src = url;



  // Attach handlers for all browsers
  script.onload = script.onreadystatechange = function(){
    if ( !done && (!this.readyState ||
            this.readyState == "loaded" || this.readyState == "complete") ) {
        done = true;
        success();
    }
  };


  head.appendChild(script);

}
