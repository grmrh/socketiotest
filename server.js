const express = require("express");
const path = require("path");
const routes = require('./routes');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(routes);

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  console.log('New client connected');

  let interval;
  if (interval) {
    clearInterval(interval);
  }
  // interval = setInterval(() => getNYTArticles(socket), 10000);
 // interval = setInterval(() => 'response from server listening', 10000);
  socket.on('ARTICLE_SAVED', (data) => io.emit('REPLY_SAVED', data));

  socket.on('disconnect',  () => {
    console.log('Client disconnected');
  })
});

/**
 * parameters: topic (trump), startYear(2017), endYear(2018)
 */
const buildQueryURL = (topic, startYear, endYear) => {
  let queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
  // add the api key parameter (the one we received when we registered)
  queryURL += "?api-key=b9f91d369ff59547cd47b931d8cbc56b:0:74623931";
  // grab text the user typed into the search input, add as parameter to url
  queryURL += "&q=" + topic;
  // if the user provides a startYear, include it in the queryURL
  //let startYear = startYear;
  if (parseInt(startYear, 10)) {
    queryURL += "&begin_date=" + startYear + "0101";
  }
  // if the user provides an endYear, include it in the queryURL
  //var endYear = endYear;
  if (parseInt(endYear, 10)) {
    queryURL += "&end_date=" + endYear + "0101";
  }
  return queryURL;
};

const getNYTArticles = async socket => {
  try {
    const res = await axios.get(buildQueryURL('trump', '2017', '2018'));
    socket.emit("ARTICLE_SAVED", () => {
      const data = res.data.response.docs;
       // take top 1 result
      const result = data.length > 1 ? data.slice(0, 1) : data;
      const response = result.map(a => {
        return {
          _id: a._id,
          title: a.headline.main,
          url: a.web_url,
          date: a.pub_date,
          saved: false
        }
      });
      return response;
    })
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

app.listen(PORT, ()  => console.log(`🌎 ==> Server now on port ${PORT}!`));
