var ical = require('ical');

ical.fromURL('https://www.meetup.com/GameDevLou/events/ical/', {}, function(err, data) {
  if (err) {
    console.error(err);
    return;
  }
  for (var k in data){
    if (data.hasOwnProperty(k)) {
      var ev = data[k];
      if (ev.type !== "VEVENT") {
        continue;
      }

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

      console.log(message);

    };

  }
});