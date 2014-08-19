var juration = require('../vendor/juration/juration.js');

var requesterIdRegEx = /requesterId=([^&]+)&/;
function extractRequesterId(node) {
  return requesterIdRegEx.exec(node.attr('href'))[1];
}

function extractExpirationDate(node) {
  return new Date(node.html().replace(/&nbsp;[\s\S]*/m,''));
}

function extractReward(node) {
  return Number(node.html().replace('$',''));
}

function extractTimeAllotted(node) {
  var timeString = node.html().trim();
  return juration.parse(timeString);
}

var hitGroupIdRegEx = /groupId=([^&]+)&/;
function extractHitGroupId(node) {
  var hitGroupIds = hitGroupIdRegEx.exec(node.attr('href'));

  return hitGroupIds ? hitGroupIds[1] : '';
}

// translate english to mongo language
var comparisonConsts = {
  'hasBeenGranted' : 1,
  'is': 2
}
var comparisonTranslation = {
  'is not less than' : '$gte',
  'is' : comparisonConsts.is, // needs special handling, use a special value
  'is greater than' : '$gt',
  'is less than' : '$lt',
  'is not greater than' : '$lte',
  'is not' : '$ne',
  'has been granted' : comparisonConsts.hasBeenGranted
};

function processQualification(node) {
  var qual = {};
  var lines = node.html().split('\n');

  qual.qual = lines[1].trim();
  qual.comparison = comparisonTranslation[lines[2].trim()];
  qual.comparisonString = lines[2].trim();

  if (typeof qual.comparison !== 'string') {
    if (qual.comparison === comparisonConsts.is) {
      qual.comparison = null;
      qual.value = lines[4].trim();
    } else if (qual.comparison === comparisonConsts.hasBeenGranted) {
      qual.comparison = null;
      qual.value = true;
    }
  } else {
    qual.value = lines[4].trim(); // parse as number etc later
  }


  return qual;
}

function processMTurkPage(err, result, $) {
  var eis = [];

  var tables = $('body > div:nth-child(7) > table:nth-child(3) > tr');

  for (var i = 0; i < tables.length; i++) {
    var table = $(tables[i]).children('td').children('table');
    
    // extracted items
    var ei = {};

    ei.name = table.find('tr:nth-child(2) > td > table > tr > td:nth-child(1) > a').html().trim();

    var requesterNode = table.find('tr:nth-child(3) > td:nth-child(3) > table > tr > td:nth-child(1) > table > tr > td:nth-child(2) > a');
    ei.requesterName = requesterNode.html().trim();
    ei.requesterId = extractRequesterId(requesterNode);

    ei.description = $('#capsule' + i + 'target > table:nth-child(1) > tr:nth-child(1) > td.capsule_field_text').html().trim();

    ei.keywords = [];
    var kwNode = $('#capsule' + i + 'target > table:nth-child(1) > tr:nth-child(2) > td.capsule_field_text > a')
    kwNode.each(function(index, val) {
      ei.keywords.push($(val).html().toLowerCase().trim());
    });

    var expirationDateNode = table.find('tr:nth-child(3) > td:nth-child(3) > table > tr > td:nth-child(2) > table > tr:nth-child(1) > td.capsule_field_text');
    ei.expirationDate = extractExpirationDate(expirationDateNode);

    ei.timeAllotted = extractTimeAllotted(table.find('tr:nth-child(3) > td:nth-child(3) > table > tr > td:nth-child(2) > table > tr:nth-child(2) > td.capsule_field_text'));

    ei.reward = extractReward(table.find('tr:nth-child(3) > td:nth-child(3) > table > tr > td:nth-child(3) > table > tr:nth-child(1) > td.capsule_field_text > span'));

    ei.hitsAvailable = Number(table.find('tr:nth-child(3) > td:nth-child(3) > table > tr > td:nth-child(3) > table > tr:nth-child(2) > td.capsule_field_text').html().trim());

    ei.hitGroupId = extractHitGroupId(table.find('tr:nth-child(2) > td > table > tr > td:nth-child(3) > span > a'));

    ei.qualifications = [];

    var qualificationsNode = $('#capsule' + i + 'target > table:nth-child(2) > tr > td:nth-child(1) > table > tr')

    // NOT off by 1... j = 1 on purpose
    // tables with no qualifications have 1 row... convenient
    for (var j = 1; j < qualificationsNode.length; j++) {
      ei.qualifications.push(processQualification($(qualificationsNode[j]).children('td')));
    }

    eis.push(ei);
  }

  // console.log(eis.length);
  return eis;

}

module.exports = processMTurkPage;