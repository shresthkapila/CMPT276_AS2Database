const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Munish@1998@localhost/people'
});

var app = express()

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => res.render('public/index.html'))

app.post('/addpeople',(req,res)=>{
  console.log("post request for /addpeople");
  var uname = req.body.name;
  var charac = req.body.character;
  var size = req.body.size;
  var height = req.body.height;
  var age = req.body.age;
  var type = req.body.type;
  var birthplace = req.body.birthplace;
  var fmove = req.body.fmove;
  var gender = req.body.gender;
  var intSize= 1*size;
  var intAge=1*age;
  var intHeight=1*height;

  if(uname && charac && size && height && age && type && birthplace && fmove && gender)  {
    var getUsersQuery = "INSERT INTO ppl VALUES ('" +uname + "','" + charac + "'," + intSize+ ","+ intHeight+"," + intAge+",'"+ type+"','"+ birthplace +"','"+ fmove+"','" +gender+"')";
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        // res.end(error);
        res.render('pages/notadded.ejs')
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/added.ejs', results);
      res.end()
      });
  }
  else {
    res.render('pages/notadded.ejs')
    res.end();
  }

});



  

app.get('/getallpeople', async (req,res) => {
  try {
    console.log("get request for /getallpeople");
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM ppl');
    const results = { 'rows': (result) ? result.rows : null};
    // console.log(result.rows);
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    // res.send("Error " + err);
    res.render('pages/notadded.ejs')
  }
})

app.post('/deletepeople', (req, res) => {
  console.log("post request for /deletepeople");
  var uname = req.body.name;
  var charac = req.body.character;

  if(uname && charac)  {
    var getUsersQuery = `DELETE FROM ppl WHERE uname = '${ uname }' AND character =  '${charac}'`;

    // var getCheckQuery = `SELECT * FROM ppl WHERE uname = '${uname} AND character = '${charac}'`;
    // pool.query(getCheckQuery, (err, ans) => {
    //   console.log(ans);
    //   if (err) {
    //     res.render('pages/notadded.ejs')
    //   }
      
    // });

    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/notadded.ejs')
        // res.send(error);
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/added.ejs', results);
      // res.end();
    });
  }
  else {
    res.render('pages/notadded.ejs')
  }
});


app.post('/modifypeople',(req,res)=>{
  console.log("post request for /modifypeople");
  var uname = req.body.name;
  var charac = req.body.character;
  var size = req.body.size;
  var height = req.body.height;
  var age = req.body.age;
  var type = req.body.type;
  var birthplace = req.body.birthplace;
  var fmove = req.body.fmove;
  var gender = req.body.gender;
  var intSize= 1*size;
  var intAge=1*age;
  var intHeight=1*height;

  
  if(uname && charac && size && height && age && type && birthplace && fmove && gender)  {
    var getUsersQuery = `UPDATE ppl SET size= ${intSize}, height=${intHeight}, age=${intAge}, type='${type}', birthplace='${birthplace}', fmove='${fmove}', gender='${gender}' where uname = '${uname}' AND character = '${charac}'`;
    
    // var getCheckQuery = `SELECT * FROM ppl where uname = '${uname} AND character = '${charac}'`;
    // pool.query(getCheckQuery, (err, ans) => {
    //   if (err) {
    //     res.render('pages/notadded.ejs')
    //   }
    // });
  
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/notadded.ejs')
        // res.send(error);
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/added.ejs', results);
      // res.end()
    });
  }
  else {
    res.render('pages/notadded.ejs')
    // res.end();
  }
});

app.get('/:id', (req,res) => {
  console.log(req.params.id);
  var getUsersQuery = `SELECT * FROM ppl WHERE uname = '${req.params.id}'`;

  console.log(getUsersQuery);

  pool.query(getUsersQuery, (error, result) => {
    if (error) {
      res.render('pages/notadded.ejs')
    }
      // res.end(error);
    var results = {'rows': result.rows };
    console.log(result);
    res.render('pages/printppl', results)
});
});


app.post('/searchpeople', (req, res) => {
  console.log("post request for /searchpeople");
  var uname = req.body.name;

  if(uname)  {
    var getUsersQuery = `SELECT * FROM ppl WHERE uname = '${uname}'`;
    pool.query(getUsersQuery, (error, result) => {
      if (error) {
        res.render('pages/notadded.ejs')
        // res.send(error);
      }
      const results = { 'rows': (result) ? result.rows : null};
      res.render('pages/printppl.ejs', results);
      // res.end();
    });
  }
  else {
    res.render('pages/notadded.ejs')
  }
});



app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
