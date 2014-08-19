processor = {};

numberOfPagesRegex = /page=([\d]+)/
processor.getNumberOfPages = function(result, $) {
  var navLinks = $('#content > div > div > div > a');
  var lastPageNode = navLinks[navLinks.length - 2];
  return 1;
  return numberOfPagesRegex.exec($(lastPageNode).attr('href'))[1];
}

processor.getRequesterData = function(result, $) {
  var requesterData = [];

  var tableRows = $('#reports > tr');

  // not off by 1, tr[0] is the header row
  for (var i = 1; i < tableRows.length; i++) {
    var requester = {};

    var row = $(tableRows[i]);

    var nameNode = row.find('td:nth-child(1) > div > a');
    requester.requesterId = extractRequesterId(nameNode);
    requester.name = nameNode.html().trim();

    requester.numberOfRatings = Number(row.find('td:nth-child(3)').text());   
    requester.modified = new Date(Date.now());

    setRatings(requester, row.find('td:nth-child(2)'));

    requesterData.push(requester);
  }

  return requesterData;
}

requesterNameRegex = /id=(.+)/
function extractRequesterId(node) {
  // console.log(node.text());
  // console.log(node.attr('href'));
  return requesterNameRegex.exec(node.attr('href'))[1];
}

function setRatings(requester, node) {
  var lines = (node.text().split('\n'));

  ['rate_comm', 'rate_fair', 'rate_pay', 'rate_fast'].forEach(function(val, index) {
    requester[val] = getRating(lines[index * 4 + 3].trim());
  });
}

var ratingRegex = /^\d\.\d\d/
function getRating(line) {
  var rating = Number(line.substring(0,4));
  return isNaN(rating) ? undefined : rating;
}

module.exports = processor;