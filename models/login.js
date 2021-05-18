var pool = require("../controllers/db");

pool.query(
  "INSERT into question_clueminati (question , id, answer, hint1 , hint2, hint3 ) values ('1.jpg','1','facebook','Book','Socialise','Mark') ON CONFLICT DO NOTHING",
  function (err, result) {
    if (err) console.log(err);
  }
);

pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 ) values ('2.jpg','2','tomcruise','Tom','Big Ship','Mission Impossible') ON CONFLICT DO NOTHING ",
  function (err, result) {
    if (err) console.log(err);
  }
);

pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 ) values ('3.jpg','3','dokodemodoor','Transportation','portable','Doraemon') ON CONFLICT DO NOTHING ",
  function (err, result) {
    if (err) console.log(err);
  }
);


pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 ) values ('4.jpg','4','brocode','Universal Rule','Never Ever break these rules','Bro') ON CONFLICT DO NOTHING ",
  function (err, result) {
    if (err) console.log(err);
  }
);


pool.query(
  "INSERT  into question_clueminati (question , id, answer, hint1 , hint2, hint3 ) values ('5.jpg','5','ironman','Genius','Billionare','Superhero') ON CONFLICT DO NOTHING",
  function (err, result) {
    if (err) console.log(err);
  }
);


exports.selectrollno = (rollno,password, callback) => {
  return pool.query(
    "select rollno from  login_clueminati WHERE rollno = $1 AND password =$2" ,
    [rollno,password],
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
    "select question_clueminati.question,question_clueminati.id,login_clueminati.score,rollno FROM question_clueminati INNER JOIN login_clueminati  ON question_clueminati.id=login_clueminati.cur_id where login_clueminati.rollno=$1",
    [rollno],
    callback
  );
};

exports.selectflag = (rollno,callback) => {
  return pool.query(
    "select flag FROM question_clueminati INNER JOIN login_clueminati ON question_clueminati.id=login_clueminati.cur_id where login_clueminati.rollno = $1" ,[rollno],
    callback
  );
};


exports.checkanswer = (rollno, callback) => {
  return pool.query(
    "select question_clueminati.answer FROM question_clueminati INNER JOIN login_clueminati ON question_clueminati.id=login_clueminati.cur_id and login_clueminati.rollno=$1",
    [rollno],
    callback
  );
};

exports.correctanswer = (score,rollno, callback) => {
  return pool.query(
    "UPDATE login_clueminati SET cur_id = cur_id+1,score=score+$1,total_hit = total_hit+1,wrong_hit=0,curhint=0 from question_clueminati where rollno =$2 and question_clueminati.id=login_clueminati.cur_id",
    [score, rollno],
    callback
  );
};

exports.updateflag = (rollno, callback) => {
  return pool.query(
   " UPDATE question_clueminati SET flag=1+flag from login_clueminati where question_clueminati.id=login_clueminati.cur_id and login_clueminati.rollno=$1 ",[rollno],
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
    "WITH Ranking AS ( SELECT *, ROW_NUMBER() OVER( ORDER BY Score desc) AS Ranks FROM login_clueminati ) SELECT rollno , score ,ranks FROM Ranking WHERE Ranks >= 1 and Ranks <=10  ORDER BY Ranks",
    callback
  );
};


