// index.js
// where your node app starts

// init project
var express = require('express')
var app = express()

const getDayName = utcDay => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return daysOfWeek[utcDay]
}
const getMonthName = utcMonth => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  return months[utcMonth]
}

function isLikelyUnixTimestamp(value) {
  const intValue = parseInt(value)
  //console.log("in isLikely; value is " + intValue + "type === number ? " + typeof intValue === 'number' )
  console.log("in isLikely; value is " + intValue)
  const minTimestamp = -8640000000000; // Approximately 270,000 years before epoch in milliseconds
  const maxTimestamp = 8640000000000;  // Approximately 270,000 years after epoch in milliseconds
  return typeof intValue === 'number' && intValue >= minTimestamp && intValue <= maxTimestamp;
}
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

app.use((req, res, next) => {
  console.log(req.method + ' ' + req.path + ' - ' + req.ip)
  next()
})

app.get('/api/:date?', (req, res) => {
  console.log('console.log says date: ' + req.params.date)
  if (!req.params.date) {
    res.json({ unix: Date.now(), utc: Date.now() })
    return
  }
  //console.log("new Date object toString():" + new Date(req.params.date).toString())
  //if parseInt(req.params.date)
  
  if (!req.params.date.includes('-') && isLikelyUnixTimestamp(req.params.date)) {
    console.log("input is valid timestamp")
    const date = new Date(parseInt(req.params.date))

    const dayOfWeek = getDayName(date.getDay())
    const month = getMonthName(date.getUTCMonth())
    const dateString =
      dayOfWeek +
      ', ' +
      date.getUTCDate().toString().padStart(2, '0') +
      ' ' +
      month +
      ' ' +
      date.getFullYear() +
      ' ' +
      date.getUTCHours().toString().padStart(2, '0') +
      ':' +
      date.getUTCMinutes().toString().padStart(2, '0') +
      ':' +
      date.getUTCSeconds().toString().padStart(2, '0') +
      ' GMT'

    res.send({ unix: parseInt(req.params.date), utc: dateString })
    return
  }

  const timestamp = Date.parse(req.params.date)

  const dayOfWeek = getDayName(new Date(req.params.date).getDay())
  const month = getMonthName(new Date(req.params.date).getUTCMonth())
  const dateString =
    dayOfWeek +
    ', ' +
    new Date(timestamp).getUTCDate().toString().padStart(2, '0') +
    ' ' +
    month +
    ' ' +
    new Date(timestamp).getUTCFullYear() +
    ' ' +
    new Date(timestamp).getUTCHours().toString().padStart(2, '0') +
    ':' +
    new Date(timestamp).getUTCMinutes().toString().padStart(2, '0') +
    ':' +
    new Date(timestamp).getUTCSeconds().toString().padStart(2, '0') +
    ' GMT'
/*
    if (isLikelyUnixTimestamp(req.params.date)) {
      console.log("input is valid timestamp")
      const date = new Date(req.params.date * 1000)
  
      const dayOfWeek = getDayName(date.getDay())
      const month = getMonthName(date.getUTCMonth())
      const dateString =
        dayOfWeek +
        ', ' +
        date.getUTCDate().toString().padStart(2, '0') +
        ' ' +
        month +
        ' ' +
        date.getFullYear() +
        ' ' +
        date.getUTCHours().toString().padStart(2, '0') +
        ':' +
        date.getUTCMinutes().toString().padStart(2, '0') +
        ':' +
        date.getUTCSeconds().toString().padStart(2, '0') +
        ' GMT'
  
      res.json({ unix: req.params.date, utc: dateString })
      return
    }
*/
  if (new Date(req.params.date).toString() === 'Invalid Date') {
    //console.log("invalid date");
    res.json({ error: 'Invalid Date' })
    return
  }
  //res.json({"unix":timestamp})
  //res.json({ utc: dateString })
  res.json({ unix: timestamp, utc: dateString })
})

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
