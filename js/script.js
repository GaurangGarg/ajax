
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var gMapsApiKey = '&key=XXXXXXXXXXX';

    $greeting.text('So, you want to live at ' + address + '?');

    var streetViewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + gMapsApiKey + '';

    $body.append('<img class="bgimg" src="' + streetViewUrl + '">');

    // load New York Times Articles
    var nytKey = 'XXXXXXXXXX';
    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    nytUrl += '?' + $.param({
      'q': cityStr,
      'sort': 'newest',
      'api-key': nytKey
    });

    $.getJSON(nytUrl, function(data) {
      $nytHeaderElem.text('New York Times Articles About ' + cityStr);

      $.each(data.response.docs, function(index, article) {
          $nytElem.append('<li class="article"> <a href="' + article.web_url + '">' + article.headline.main + '</a><p>' + article.snippet + '</p></li>');
      });
    }).error(function(e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
      });

    // load Wikipedia Articles
    var wikiUrl = 'https://en.wikipedia.org/w/api.php';
    wikiUrl += '?' + $.param({
      'action': 'opensearch',
      'search': cityStr,
      'format': 'json',
      'callback': 'wikiCallback'
    });

    var wikiRequestTimeout = setTimeout(function() {
      $wikiElem.text("Failed to get Wikipedia Resources");
    }, 8000);

    $.ajax({
      url: wikiUrl,
      dataType: 'jsonp'
    }).done(function(data) {
        var wikiTopics = data[1];
        var wikiDescriptions = data[2];
        var wikiUrls = data[3];
        var length = wikiTopics.length;
        for (var i = 0; i < length; i++) {
          $wikiElem.append('<li><a href="' + wikiUrls[i] + '">' + wikiTopics[i] + '</a></li>');
        }
        clearTimeout(wikiRequestTimeout);
      });

    return false;
};

$('#form-container').submit(loadData);
