var ical = require('ical');
var async = require('async');
var nodemailer = require('nodemailer');

var emailAddress = "warpbot@louisvillemakesgames.org";
var password = process.env.WARPBOT_PASSWORD;

var smtpParams = 'smtps://' + encodeURIComponent(emailAddress) + ':' + encodeURIComponent(password) + '@smtp.gmail.com';

var transporter = nodemailer.createTransport(smtpParams);

var today = new Date();
var cutoffDate = new Date();
cutoffDate.setMonth(cutoffDate.getMonth() + 1);

var calendars = [ 'https://calendar.google.com/calendar/ical/louisvillemakesgames.org_jq7pden9rgkcpkh6pnni3bmvjg%40group.calendar.google.com/public/basic.ics',
'https://www.meetup.com/GameDevLou/events/ical/'
];

async.map(calendars, getCalendar, function(err, results){
  if (err) {
    console.error(err);
    return;
   }

  var eventArrays = results.map(objectValues);
  var events = Array.prototype.concat.apply ([], eventArrays);

  var filteredEvents = events.filter(isValidEvent).sort(compareEventsByStartDate);
  sendEmail(filteredEvents, afterSent);

});

function sendEmail (events, callback) {
  var mailOptions = {
      from: '"Warp Bot" <'+ emailAddress +'>',
      to: 'abezuska@louisvillemakesgames.org',//, directors@louisvillemakesgames.org',
      subject: 'Hello ✔',
      text: events.map(eventToMessage).join("\n")//,  html: '<b>Hello world 🐴</b>'
  };

  transporter.sendMail(mailOptions, callback);
}

function afterSent(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
}

function compareEventsByStartDate (a,b) {
  var startA = new Date(a.start);
  var startB = new Date(b.start);
  return startA - startB;
}

function getCalendar (url, callback) {
  ical.fromURL(url, {}, callback);
}

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


  var start = new Date(ev.start);
  var end = new Date(ev.end);

  if (end < today) {
    return false;
  }
  if (start > cutoffDate) {
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
    ev.summary,
    // "from",
     start.toLocaleDateString(),
    // start.toLocaleTimeString(),
    // "to",
    // end.toLocaleDateString(),
    // end.toLocaleTimeString()
  ].join(" ");

  return message;
}
