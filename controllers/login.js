

const {selectrollno,updatefirstlogin,selecttotalhit,mainpage,checkanswer,correctanswer,updateflag,updatefirstanswer,updatewronghit, updatecurhint, selecthint, deducthint1,deducthint2,deducthint3,leaderboard,selectf,updatef0,updatef1}=require("../models/login")

var roll

exports.login = async (request, response, next) => {
    try{
        if(request.body.rollno && request.body.password)
        {
            const getsession= await selectf(request.body.rollno)
            if(getsession.rowCount>0){
            roll=getsession.rows[0].rollno
            if (getsession.rows[0].f === 1) {
                const getrollno = await selectrollno(roll,request.body.password);
                if(getrollno.rowCount > 0){
                    const updatesf1 = await updatef1(roll);
                    if(getrollno.rows[0].first_login === 0)
                    {
                        var d = new Date();
                        var n = d.getTime();
                        const updatefirstlogin_=await updatefirstlogin(n,roll);
                        response.redirect("/getdata");
                    }
                    else response.redirect("/getdata");
                }
                else response.render("challenges/login",{
                    message:"Enter valid credentials"
                });
            }
            else {
                const updatesf1 = await updatef1(roll);
                 response.redirect("/getdata");
            }
        }
        else response.render("challenges/login",{
            message:"Register on INFOTREK'21 website"
        });
        }
        else 
        response.render("challenges/login",{
            message:"register yourself first"
        });
    }catch (err) {
        next(err)
      }
}

exports.getdata = async (request, response, next) => {
    try{
        const getsession= await selectf(roll)
        if(getsession.rowCount>0){
            if (getsession.rows[0].f === 1) {
            const selecttotal_hit=await selecttotalhit(roll);
            if(selecttotal_hit.rows[0].total_hit === 6)
            {
                request.session.loggedIn = false;
                  response.render("challenges/thanks");
            }
            else {
                const getmain = await mainpage(roll);
                response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                          });
            }
        }
        else {
            response.redirect("/");
          }
        }
        else response.render("challenges/error");
}catch (err) {
    next(err)
  }
}

exports.submit = async (request, response, next) => {
    try{
        const getsession= await selectf(roll)
        if(getsession.rowCount>0){
        if (getsession.rows[0].f === 1) {
            const check = await checkanswer(roll);
            if(request.body.guess === check.rows[0].answer){
                if (check.rows[0].flag === 1) {
                    var d = new Date();
                    var n = d.getTime();
                    var score;
                    if ((n - check.rows[0].first_time) / 1000 < 60) score = 200;
                    else if (
                      (n - check.rows[0].first_time) / 1000 < 120 &&
                      (n - check.rows[0].first_time) / 1000 >= 60
                    )
                    score = 170;
                    else score = 150;

                    const updatescore=await correctanswer(score,n,roll);
                    const selecttotal_hit=await selecttotalhit(roll);
                    if(selecttotal_hit.rows[0].total_hit === 6)
                    {
                        request.session.loggedIn = false;
                          response.render("challenges/thanks");
                    }
                    else{
                        const getmain = await mainpage(roll);
                        response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                          });
                    }
            }
            else{
                var d = new Date();
                var n = d.getTime();
                const updatefirst_login = await updatefirstanswer(200,roll);
                const updatefq=await updateflag(n,roll)
                const selecttotal_hit=await selecttotalhit(roll);
                    if(selecttotal_hit.rows[0].total_hit === 6)
                    {
                        request.session.loggedIn = false;
                          response.render("challenges/thanks");
                    }
                    else {
                        const getmain = await mainpage(roll);
                        response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                          });
                    }

            }
        }
        else {
            const wronganswer= await updatewronghit(roll);
            const getmain = await mainpage(roll);
            response.render("layout/main", {
                score: getmain.rows[0].score,
                question:getmain.rows[0].question,
                id: getmain.rows[0].id,
              });
        }
    }
    else {
        response.redirect("/");
      }
      } else  response.render("challenges/error");
    }catch (err) {
        next(err)
      }
}

exports.hint = async (request, response, next) => {
    try{
        const getsession= await selectf(roll)
        if(getsession.rowCount>0){
        if (getsession.rows[0].f === 1) {
            const u_curhint = await updatecurhint(roll);
            const gethint = await selecthint(roll)
            if(gethint.rows[0].curhint === 1)
            {
                const h1= await deducthint1(roll)
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2: " ",
                    hint3: " ",
                    message: "you have used your 20 Coins :(",
                  };
                  response.send(hint)
            }
           else if(gethint.rows[0].curhint === 2)
            {
                const h2= await deducthint2(roll)
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2:  gethint.rows[0].hint2,
                    hint3: " ",
                    message: "you have used your 30 Coins :(",
                  };
                  response.send(hint)
            }
           else if(gethint.rows[0].curhint === 3)
            {
                const h3= await deducthint3(roll)
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2: gethint.rows[0].hint2,
                    hint3: gethint.rows[0].hint3,
                    message: "you have used your 50 Coins :(",
                  };
                  response.send(hint)
            }
          else  if(gethint.rows[0].curhint > 3)
            {
               
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2: gethint.rows[0].hint2,
                    hint3: gethint.rows[0].hint3,
                    message: " ",
                  };
                  response.send(hint)
            }
        }
        else {
            response.redirect("/");
          }
      } else  response.render("challenges/error");
}catch (err) {
    next(err)
  }
}

exports.scoreboard = async (request, response, next) => {
    try{
        const ld = await leaderboard();
        response.render("challenges/leaderboard", { data: ld.rows });

    }catch (err) {
    next(err)
  }
}


exports.logout = async (request, response, next) => {
    try{
        const updatesf = await updatef0(roll);
        response.render("challenges/login",{
            message:"logout successful "
        });

    }catch (err) {
    next(err)
  }
}