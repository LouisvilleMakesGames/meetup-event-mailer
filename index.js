var ical = require('ical');

ical.fromURL('https://www.meetup.com/GameDevLou/events/ical/', {}, generateEmail);


function generateEmail (err, data) {
  if (err) {
    console.error(err);
    return;
  }

  var messages = objectValues(data).filter(isValidEvent).map(eventToMessage);
  console.log(messages);

}

function objectValues(obj) {
  return Object.keys(obj).map( (key) => obj[key] );
}

function isValidEvent (ev) {
  if (ev.type !== "VEVENT") {
    return false;
  }
  return true;
}

function eventToMessage (ev) {
  var start = new Date(ev.start);
  var end = new Date(ev.end);

  var message = [
    ev.summary,
    "from",
    start.toLocaleDateString(),
    start.toLocaleTimeString(),
    "to",
    end.toLocaleDateString(),
    end.toLocaleTimeString()
  ].join(" ");

  return message;
}