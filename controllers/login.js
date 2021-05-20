

const {selectrollno,selecttotalhit,mainpage,checkanswer,correctanswer,updatefirstanswer,updatewronghit, updatecurhint, selecthint, deducthint1,deducthint2,deducthint3,leaderboard, selectflag, updateflag}=require("../models/login")



exports.login = async (request, response, next) => {
    try{
        var rollno = request.body.rollno;
        var password = request.body.password;
        if(`${rollno}`.length===9  && rollno>=100000000 && password)
        {
            const getrollno = await selectrollno(rollno,password);
                if(getrollno.rowCount>0)
                {
                    request.session.loggedIn = true;
                    request.session.rollno = getrollno.rows[0].rollno ;
                    response.redirect("/");
                }
                else 
                {
                    response.render("challenges/login",{
                        message:"Invalid Credentials"
                    })
                }
        }
        else 
        {
          
        response.render("challenges/login",{
            message:"Invalid Credentials"
        });}
    }catch (err) {
      console
      }
}

exports.getdata = async (request, response, next) => {
    try{
        if (request.session.loggedIn) {
            const selecttotal_hit=await selecttotalhit(request.session.rollno);
            if(selecttotal_hit.rows[0].total_hit >= 25)
            {
                request.session.loggedIn = false;
                  response.render("challenges/thanksday");
            }
            else {
                const getmain = await mainpage(request.session.rollno);
                response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                            rollno:getmain.rows[0].rollno
                          });
            }
        }
        else {
            response.redirect("login");
          }
}catch (err) {
  console
  }
}

exports.submit = async (request, response, next) => {
    try{
        if (request.session.loggedIn) {
            const check = await checkanswer(request.session.rollno);
            if(request.body.guess === check.rows[0].answer){
                const selectl = await selectflag(request.session.rollno);
                if (selectl.rows[0].flag<15 && selectl.rows[0].flag >=1) {
                    score=200-(selectl.rows[0].flag)*10;
                    const updatel = await updateflag(request.session.rollno)
                    const updatescore=await correctanswer(score,request.session.rollno);
                    const selecttotal_hit=await selecttotalhit(request.session.rollno);
                    if(selecttotal_hit.rows[0].total_hit >= 25)
                    {
                        request.session.loggedIn = false;
                          response.render("challenges/thanksday");
                    }
                    else{
                        const getmain = await mainpage(request.session.rollno);
                        response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                            rollno:getmain.rows[0].rollno
                          });
                    }
            }
            else if (selectl.rows[0].flag == 0 ){
                const updatel = await updateflag(request.session.rollno)
                const updatefirst_login = await updatefirstanswer(200,request.session.rollno);
                const selecttotal_hit=await selecttotalhit(request.session.rollno);
                    if(selecttotal_hit.rows[0].total_hit >= 25)
                    {
                        request.session.loggedIn = false;
                          response.render("challenges/thanksday");
                    }
                    else{
                        const getmain = await mainpage(request.session.rollno);
                        response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                            rollno:getmain.rows[0].rollno
                          });
                    }
            }
            else if(selectl.rows[0].flag >= 15)
            {
                const updatel = await updateflag(request.session.rollno)
                const updatefirst_login = await updatefirstanswer(50,request.session.rollno);
                const selecttotal_hit=await selecttotalhit(request.session.rollno);
                    if(selecttotal_hit.rows[0].total_hit >= 25)
                    {
                        request.session.loggedIn = false;
                          response.render("challenges/thanksday");
                    }
                    else{
                        const getmain = await mainpage(request.session.rollno);
                        response.render("layout/main", {
                            score: getmain.rows[0].score,
                            question:getmain.rows[0].question,
                            id: getmain.rows[0].id,
                            rollno:getmain.rows[0].rollno
                          });
                    }
            }
            }
            else {
                const wronganswer= await updatewronghit(request.session.rollno);
            const getmain = await mainpage(request.session.rollno);
            response.render("layout/main", {
                score: getmain.rows[0].score,
                question:getmain.rows[0].question,
                id: getmain.rows[0].id,
                rollno:getmain.rows[0].rollno
              });
            }
        }
    else 
        response.redirect("login");
    }catch (err) {
      console
      }
}

exports.hint = async (request, response, next) => {
    try{
        if (request.session.loggedIn) {
            const u_curhint = await updatecurhint(request.session.rollno)
            const gethint = await selecthint(request.session.rollno)
            if(gethint.rows[0].curhint === 1)
            {
                const h1= await deducthint1(request.session.rollno)
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2: " ",
                    hint3: " ",
                    message: "you have used your 20 Coins ",
                  };
                  response.send(hint)
            }
           else if(gethint.rows[0].curhint === 2)
            {
                const h2= await deducthint2(request.session.rollno)
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2:  gethint.rows[0].hint2,
                    hint3: " ",
                    message: "you have used your 30 Coins ",
                  };
                  response.send(hint)
            }
           else if(gethint.rows[0].curhint === 3)
            {
                const h3= await deducthint3(request.session.rollno)
                const hint = {
                    hint1: gethint.rows[0].hint1,
                    hint2: gethint.rows[0].hint2,
                    hint3: gethint.rows[0].hint3,
                    message: "you have used your 50 Coins ",
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
        else 
            response.redirect("login");
}catch (err) {
  console
  }
}

exports.scoreboard = async (request, response, next) => {
    try{
        const ld = await leaderboard();
        response.render("challenges/leaderboard", { data: ld.rows });

    }catch (err) {
  console
  }
}


exports.logout = async (request, response, next) => {
    try{
        request.session.loggedIn = false
        response.render("challenges/login",{
            message:"logout successful "
        });

    }catch (err) {
  console
  }
}