import Express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = new Express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser('express_react_cookie'));
app.use(session({
    secret: 'express_react_cookie',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 60*1000*30
    }
}));

app.get('/blogs', (req, res) => {

  return res.send({
    blogs: ['neibudaili', 'chenggongla', 'la!', 'hahahaha']
  });
});

app.listen(8000, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${8000} [${process.env.NODE_ENV}]`);
});