var pool = require("../controllers/db");

pool.query(
  "INSERT into question_clueminati (question , id, answer, hint1 , hint2, hint3 , first_time, flag) values ('16.jpg','1','a','Crowd','Cheap','OLX','0','0') ON CONFLICT DO NOTHING",
  function (err, result) {
    if (err) console.log(err);
  }
);

pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 , first_time, flag) values ('16.jpg','2','b','Crowd','Cheap','OLX','0','0') ON CONFLICT DO NOTHING ",
  function (err, result) {
    if (err) console.log(err);
  }
);

pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 , first_time, flag) values ('16.jpg','3','c','Crowd','Cheap','OLX','0','0') ON CONFLICT DO NOTHING ",
  function (err, result) {
    if (err) console.log(err);
  }
);


pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 , first_time, flag) values ('16.jpg','4','d','Crowd','Cheap','OLX','0','0') ON CONFLICT DO NOTHING ",
  function (err, result) {
    if (err) console.log(err);
  }
);


pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 , first_time, flag) values ('16.jpg','5','e','Crowd','Cheap','OLX','0','0') ON CONFLICT DO NOTHING",
  function (err, result) {
    if (err) console.log(err);
  }
);


pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 , first_time, flag) values ('16.jpg','6','f','Crowd','Cheap','OLX','0','0') ON CONFLICT DO NOTHING",
  function (err, result) {
    if (err) console.log(err);
  }
);

exports.selectf = (rollno, callback) => {
  return pool.query(
    "select rollno,f from  session_clueminati WHERE rollno = $1" ,
    [rollno],
    callback
  );
};

exports.updatef0 = (rollno, callback) => {
  return pool.query(
    "update session_clueminati set f=0 WHERE rollno = $1" ,
    [rollno],
    callback
  );
};

exports.updatef1 = (rollno, callback) => {
  return pool.query(
    "update session_clueminati set f=1 WHERE rollno = $1" ,
    [rollno],
    callback
  );
};

exports.selectrollno = (rollno,password, callback) => {
  return pool.query(
    "select rollno from  login_clueminati WHERE rollno = $1 AND password =$2" ,
    [rollno,password],
    callback
  );
};

exports.updatefirstlogin = (n,rollno, callback) => {
  console.log(1);
  return pool.query(
    "UPDATE login_clueminati SET first_login=$1 where rollno =$2 ",[n,rollno],
    callback
  );
};

exports.selecttotalhit = (rollno, callback) => {
  return pool.query(
    "select total_hit from  login_clueminati WHERE rollno = $1 " ,
    [rollno],
    callback
  );
};

exports.mainpage = (rollno, callback) => {
  return pool.query(
    "select question_clueminati.question,question_clueminati.id,login_clueminati.score FROM question_clueminati INNER JOIN login_clueminati  ON question_clueminati.id=login_clueminati.cur_id where login_clueminati.rollno=$1",
    [rollno],
    callback
  );
};

exports.checkanswer = (rollno, callback) => {
  return pool.query(
    "select question_clueminati.answer,login_clueminati.rollno, question_clueminati.first_time,question_clueminati.flag,question_clueminati.id FROM question_clueminati INNER JOIN login_clueminati ON question_clueminati.id=login_clueminati.cur_id where login_clueminati.rollno=$1",
    [rollno],
    callback
  );
};

exports.correctanswer = (score,n,rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET cur_id = cur_id+1,score=score+$1,cur_img_time=$2,total_hit = total_hit+1,wrong_hit=0,curhint=0 from question_clueminati where rollno =$3 and question_clueminati.id=login_clueminati.cur_id",
    [score, n, rollno],
    callback
  );
};

exports.updateflag = (n,rollno, callback) => {
  return pool.query(
   " UPDATE question_clueminati SET flag=1,first_time=$1 from login_clueminati where question_clueminati.id=login_clueminati.cur_id and rollno =$2",
    [n,rollno],
    callback
  );
};

exports.updatefirstanswer = (score,rollno, callback) => {
  return pool.query(
   " UPDATE login_clueminati SET cur_id = cur_id+1,score=score+$1,total_hit = total_hit+1,wrong_hit=0,curhint=0 from question_clueminati where question_clueminati.id=login_clueminati.cur_id and rollno =$2",
    [score,rollno],
    callback
  );
};

exports.updatewronghit = (rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET wrong_hit = wrong_hit+1 from question_clueminati where rollno =$1 and question_clueminati.id=login_clueminati.cur_id",
    [rollno],
    callback
  );
};

exports.updatecurhint = (rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET curhint = curhint+1 from question_clueminati where rollno =$1 and question_clueminati.id=login_clueminati.cur_id",
    [rollno],
    callback
  );
};

exports.selecthint = (rollno, callback) => {
  return pool.query(
    "select login_clueminati.curhint,question_clueminati.hint1,question_clueminati.hint2,question_clueminati.hint3 FROM question_clueminati  INNER JOIN login_clueminati  ON question_clueminati.id=login_clueminati.cur_id where login_clueminati.rollno=$1",
    [rollno],
    callback
  );
};

exports.deducthint1 = (rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET score=score-20 where rollno =$1 ",
    [rollno],
    callback
  );
};

exports.deducthint2 = (rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET score=score-30 where rollno =$1 ",
    [rollno],
    callback
  );
};

exports.deducthint3 = (rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET score=score-50 where rollno =$1 ",
    [rollno],
    callback
  );
};

exports.leaderboard = ( callback) => {
  return pool.query(
    "WITH Ranking AS ( SELECT *, ROW_NUMBER() OVER( ORDER BY Score desc , first_login asc) AS Ranks FROM login_clueminati ) SELECT rollno , score ,ranks FROM Ranking WHERE Ranks >= 1 and Ranks <=11  ORDER BY Ranks",
    callback
  );
};


