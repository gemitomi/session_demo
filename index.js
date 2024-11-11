import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
const app = express()
const port = 3000

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

app.use('/myuploads', express.static('uploads'));

app.use('/static', express.static('public'));

app.post('/', upload.single ("alma"), (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  res.send('Hello World!');
})

app.get('/', (req, res, next) => {
  fs.readdir('./uploads', (err, fileList) => {
    let html = "<html><body><a href='/login.html'/>";
    for (let i=0; i<fileList.length; i++) {
      html += `<img src='myuploads/${fileList[i]}' style="padding:30px">`
    }
    return res.send(html);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})