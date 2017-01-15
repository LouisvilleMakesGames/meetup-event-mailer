var ical = require('ical');
var async = require('async');

var calendars = [ 'https://calendar.google.com/calendar/ical/louisvillemakesgames.org_jq7pden9rgkcpkh6pnni3bmvjg%40group.calendar.google.com/public/basic.ics',
'https://www.meetup.com/GameDevLou/events/ical/'
];


// generateEmail

async.map(calendars, getCalendar, function(err, results){
  if (err) {
    console.error(err);
    return;
   }

  var eventArrays = results.map(objectValues);
  var events = Array.prototype.concat.apply ([], eventArrays);

  var messages = events.filter(isValidEvent).map(eventToMessage);
  console.log(messages);

});

function getCalendar (url, callback) {
  ical.fromURL(url, {}, callback);
}

// function generateEmail (err, data) {
//   if (err) {
//     console.error(err);
//     return;
//   }
//
//
// }


var tha
function objectValues(obj) {
  return Object.keys(obj).map( (key) => obj[key] );
}


var warpzoneMatch = /warp zone/i;
var streetMatch = /607.*main/i;
var alleyMatch = /612.*washington/i;

function matchRegEx(string, exp) {
  return string.match(exp) === null;
}

function isValidEvent (ev) {

  if (ev.type !== "VEVENT") {
    return false;
  }
  if (!ev.location){
    if (ev.url && ev.url.indexOf("https://www.meetup.com/GameDevLou/") !== -1) {
      ev.location = "Warp Zone";
    }
    else {
      return false;
    }
  }
  if (matchRegEx(ev.location, warpzoneMatch)
    && matchRegEx(ev.location, streetMatch)
    && matchRegEx(ev.location, alleyMatch)
  ) {
    return false;
  }
  return true;
}

function eventToMessage (ev) {
  var start = new Date(ev.start);
  var end = new Date(ev.end);

  var message = [
    ev.location,
    " ===== ",
    ev.summary//,
    // "from",
    // start.toLocaleDateString(),
    // start.toLocaleTimeString(),
    // "to",
    // end.toLocaleDateString(),
    // end.toLocaleTimeString()
  ].join(" ");

  return message;
}

