var ical = require('ical');
var async = require('async');
var nodemailer = require('nodemailer');
var moment = require('moment');
var fs = require("fs");
var handlebars = require("handlebars");


config = {
  fromName: "Warp Bot",
  emailAddress: "warpbot@louisvillemakesgames.org",
  password : process.env.WARPBOT_PASSWORD,
  to: "abezuska@louisvillemakesgames.org",
  subject: 'Warp Zone Louisville - Security door schedule',
  template: './template.html',
  calendars: [ 'https://calendar.google.com/calendar/ical/louisvillemakesgames.org_jq7pden9rgkcpkh6pnni3bmvjg%40group.calendar.google.com/public/basic.ics',
  'https://www.meetup.com/GameDevLou/events/ical/'
  ]
};

var smtpParams = 'smtps://' + encodeURIComponent(config.emailAddress) + ':' + encodeURIComponent(config.password) + '@smtp.gmail.com';

var transporter = nodemailer.createTransport(smtpParams);

var today = new Date();
var cutoffDate = new Date();
cutoffDate.setMonth(cutoffDate.getMonth() + 1);

async.map(config.calendars, getCalendar, function(err, results){
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
  var template = fs.readFileSync(config.template, "utf8");
  var template = handlebars.compile(template);
  var mailOptions = {
      from: '"'+ config.fromName +'" <'+ config.emailAddress +'>',
      to: config.to,
      subject: config.subject,
      text: template(events.map(formatData)),
      html: template(events.map(formatData)),
  };

  //console.log( template( events.map(formatData) ));
  transporter.sendMail(mailOptions, callback);
}


function formatData (ev) {
  var obj = {};
    obj.name = ev.summary,
    obj.startDate = moment(ev.start).format('MMM DD');
    obj.startTime = moment(ev.start).subtract(15, 'minutes').format('h:mm a');
    obj.endDate = moment(ev.end).format('MMM DD');
    if (obj.startDate === obj.endDate){
      obj.endDate = "";
    }
    obj.endTime = moment(ev.end).add(15, 'minutes').format('h:mm a');

  return obj;
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
