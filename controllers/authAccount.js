const mysql = require("mysql2");
const bcrypt = require('bcrypt');
constjwt = require('jsonwebtoken');

const db = mysql.createConnection({
  database: process.env.DATABASE,
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
});

exports.signup = (req, res) => {
  const { first_name, last_name, email, password, confirmPassword } = req.body;
  db.query
  (
    'SELECT email FROM accounts WHERE email = ?',
    email,
    async(error, results) => 
    {
      if (error){
        console.log(error);
      }if (results.length > 0){
        res.render(`register`,{ errorMsg: 'Email entered is already in use!', color: 'red'} )
      }else if (confirmPassword !== password){
        res.render('register',{ errorMsg: 'Wrong Password!', color: 'red'})
      }

      const hashPassword = await bcrypt.hash(password,8);
      console.log(hashPassword);

      db.query(
        "INSERT INTO accounts SET ?",
        {
          first_name,
          last_name,
          email,
          hashPassword,
        },
        (error, results) => 
          {
            if (error) {
              console.log(error.message);
            } else {
              console.log(results);
              return res.render("register.hbs", 
              {
                message: `You have successfully registered`, color: "alert-success",
              });
            }
          }
        );
      }       
  )}

////
// logIn function

exports.login = async(req,res) => 
{
  const {email,password} = req.body;
  if (email === "" || password === "") 
  {
    res.render("index",{errorMsg: "Email and password should not be empty!"})
  } else 
    {
      db.query(
        "SELECT email, password FROM accounts WHERE email = ? ",
        email,
        async(error, results) => 
        {
          if (error){

            }
            if (!results.length > 0) 
            {
              res.render("index", {error : "The email does not exist!"});
            }
            else if (!(await bcrypt.compare(password, results[0].password)))
            {
              res.render("index", {error : "Password is incorrect"});
            }
            else 
            {
              const account_id = results[0].accounts_id;
              console.log(account_id);
              const token = jwt.sign(account_id,process.env.JWTSECRET,{expiresIn: process.env.JWTEXPIRES});
              console.log(token);
              // const decoded = jwt.decode(token,{complete: true});
              // console.log(decoded);
              const cookieoptions = {expires: new Date(Date.now() + process.env.COOKIEEXPIRE * 24 * 60 * 60 * 1000),
              httpOnly: true}
              res.cookie("JWT", token, cookieoptions);
              console.log(cookieoptions);

              const list = db.query(
                "SELECT * FROM accounts",
                (error, results) => {
                  console.log(results);
                  res.render("listaccounts", {message : " TITLE ", users: results});
                  
                  }                
                )
              
            }
        }
      )
    }
   
}
// Populate update function
exports.updateform = (req,res) => {
  const email = req.params.email;
  db.query(
    "SELECT * FROM accounts WHERE email = ? ",
    email,
    (error, result) => {
      console.log(result)
      res.render("updateform",{result: result[0]});
    });
};


// Modifying Update function
exports.updateuser = (req,res) =>{
  const {first_name, last_name, email} = req.body;
  if (first_name === "" || last_name === "") {
    res.render("updateform", 
    {message: "First and Last Name should not be empty",
    color: "alert-danger",
    result: {first_name: first_name, last_name: last_name, email: email},
  });
  }else {
    db.query(
      `UPDATE accounts SET first_name = "${first_name}", last_name = "${last_name}" WHERE email = "${email}"`,
      (error, result) => {
        if (error){
        console.log(error);
      }else{
        db.query(
          "SELECT * FROM accounts",
          (error, results) => {
            res.render("listaccounts", {title: "List of Users", accounts: results,});
          }
        );
      }
      }
    )
  }
}


exports.logout = (req,res) => {
  // if (req.session) {
  //   req.session.destroy((error) => {
  //     if(error){
  //       res.status(400).send("Unable to logout")
  //     }else{
  //       res.clear.cookie("JWT").status(200).json{message:"Succesfully logout"}
  //       res.render("index")
  //     }
  //   }) 
  // }else{
  //   console.log("no session");
  //   res.end;
  // }
  res.clear.cookie("JWT").status(200);
  res.render("index", {message: "Succesfully logout"});
};


exports.skills = (req,res) => {

}
