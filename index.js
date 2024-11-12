import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import session from 'express-session';
const app = express();
const port = 3000

app.use('/static', express.static('public'));

app.use(session({
  secret: 'kjk56jk65jknkj5k',
  resave: false,
  saveUninitialized: true
}))

function authMW(req, res, next){
  if (req.session.belepve !== 12) {
    console.log("Nix belépve!");
    return res.redirect('/');
  }
  console.log("Minden fasza!");
  return next();
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename : function (req, file, cb) {
    const rnd = Math.round(Math.random() * 1E9);
    const ext = path.ext = path.extname(file.originalname).toLowerCase();
    return cb(null, `${file.fieldname}-${Date.now()}-${rnd}${ext}`);
    // például: alma-20240202-8789473793.jpg
  }
})

const upload = multer({ storage })

app.use('/myuploads', authMW, express.static('uploads'));

app.get('/logout', authMW, (req, res, next) => {
  return req.session.destroy(err => {
    console.log(err);
    return res.redirect('/');
  })
})

app.post('/', authMW, upload.single ("alma"), (req, res, next) => {
  //console.log(req.file);
  console.log(req.body.text);
  res.send('Hello World!');
})

app.get('/', (req, res, next) => {
  console.log(req.session);
  fs.readdir('./uploads', (err, fileList) => {
    let html = "<html><body>";
    if (req.session.belepve === 12) {
      html += "<a href='/logout'/>Logout</a><br/>";
    } else {
      html += "<a href='/static/login.html'/>Login</a><br/>";
    }
    for (let i=0; i<fileList.length; i++) {
      html += `<img src='myuploads/${fileList[i]}' style="padding:30px">`
    }
    return res.send(html);
  });
});

app.post('/login', upload.none(), (req, res, next) => {
  if (typeof req.body.jelszo === 'undefined'){
    return res.status(404).end("no");
  }

  if (req.body.jelszo === "asdasd") {
    req.session.belepve = 12;
    return req.session.save((err) => {
      console.log(err);
      return res.redirect('/');
    }) 
  }

  return res.redirect('/static/login.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})