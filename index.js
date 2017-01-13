var ical = require('ical');
var calendarUrl = 'https://calendar.google.com/calendar/ical/louisvillemakesgames.org_jq7pden9rgkcpkh6pnni3bmvjg%40group.calendar.google.com/public/basic.ics';

ical.fromURL(calendarUrl, {}, generateEmail);


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

/*
var eventsample = { type: 'VEVENT',
  params: [],
  start: { 2016-01-13T19:00:00.000Z tz: 'America/New_York' },
  end: { 2016-01-13T20:00:00.000Z tz: 'America/New_York' },
  rrule:
   { _string: null,
     _cache: { all: false, before: [], after: [], between: [] },
     origOptions:
      { freq: 2,
        byweekday: [Object],
        dtstart: 2016-01-13T19:00:00.000Z },
     options:
      { freq: 2,
        dtstart: 2016-01-13T19:00:00.000Z,
        interval: 1,
        wkst: 0,
        count: null,
        until: null,
        bysetpos: null,
        bymonth: null,
        bymonthday: [],
        byyearday: null,
        byweekno: null,
        byweekday: [Object],
        byhour: [Object],
        byminute: [Object],
        bysecond: [Object],
        byeaster: null,
        bynmonthday: [],
        bynweekday: null },
     timeset: [ [Object] ] },
  dtstamp: '20170113T023512Z',
  uid: 'nj8ihu9nve8ipfqidfssuum76o@google.com',
  created: '20160921T172216Z',
  description: '',
  'last-modified': '20160921T172936Z',
  location: '',
  sequence: '0',
  status: 'CONFIRMED',
  summary: '#IndieDevHour',
  transparency: 'OPAQUE',
  '00EC7E30-9C66-4957-8660-BBC3AAF1CAE1':
   { type: 'VALARM',
     params: [],
     action: 'NONE',
     trigger: { params: [Object], val: '19760401T005545Z' },
     'WR-ALARMUID': '00EC7E30-9C66-4957-8660-BBC3AAF1CAE1',
     uid: '00EC7E30-9C66-4957-8660-BBC3AAF1CAE1',
     acknowledged: '20160224T183112Z',
     'APPLE-DEFAULT-ALARM': 'TRUE' } } */