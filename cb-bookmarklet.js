var SEPARATOR = "\t";

getScript('https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js', function(){ 
  prepDocumentForPolymer(function() {
    runBookmarklet();
  });
});

function prepDocumentForPolymer(callback) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'import');
    link.setAttribute('href', '//www.polymer-project.org/0.5/components/polymer/polymer.html');
    link.onload = callback;
    document.head.appendChild(link);
}


function runBookmarklet() {
    var data = getScrapedData();
    //var csvData = arrayToCsv(data);
    prependDataToDocument(data);
}

function prependDataToDocument(data) {
    Polymer.import(['//www.polymer-project.org/components/paper-dialog/paper-dialog.html'], function() {
        var table = $(document.createElement("table")).append("<thead></thead><tbody></tbody>");
        var generateRow = function(arr) {
            return '<td>' + arr.join("</td><td>") + '</td>';
        }

        table.find("thead").append(generateRow(["Date", "URLs", "Unpenalized URLs", "Live SERP", "Domains"]));
        var tbody = table.find("tbody");
        $.each(data, function(i, val) {
            tbody.append("<tr>"+generateRow(rowObjectToArray(val))+"</tr>");
        });

        $(document.body).prepend('<paper-dialog heading="Data" opened="true"></paper-dialog>');
        $('paper-dialog').append(table);
    });
}

function rowObjectToArray(rowObject) {
    return [rowObject.date, rowObject.urls, rowObject.unpenalizedUrls, rowObject.liveSerp, rowObject.domains];
}

function arrayToCsv(arr) {
    var csvData = ["Date", "URLs", "Unpenalized URLs", "Live SERP", "Domains"].join(SEPARATOR) + "\n";
    for(var i = 0; i < arr.length; i++) {
        var rowObject = arr[i];
        var dataRow = rowObjectToArray(rowObject);
        csvData += dataRow.join(SEPARATOR) + "\n";
    }
    return csvData;
}

function getScrapedData() {
    var data = [];
    $("#history tbody > tr").filter(function(){
        return $(this).find('td').size() > 2
    }).map(
        function(i, val) { 
            data.push(extractDataFromRow(val));
        }
    );
    return data;
}

function extractDataFromRow(row) {
    return {
        "date": $(row.children[0]).text(),
        "urls": $(row.children[1]).text(),
        "unpenalizedUrls": $(row.children[2]).text(),
        "liveSerp": $(row.children[3]).text(),
        "domains": $(row.children[4]).text()
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
