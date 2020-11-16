const express = require("express");
const app = express();
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
// const request = require("request");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

mailchimp.setConfig({
  //*****************************ENTER YOUR API KEY HERE******************************
  apiKey: 123,
  //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
  server: "us7"
});

const listId = "a179ccd4f7";

app.post("/failure",function(req,res){
  res.redirect("/");
})

app.listen(process.env.PORT||3000,function(req,res){
  console.log("port 3000 is running.");
})

app.get("/",function(req,res){
  res.sendFile("signup.html",{root:__dirname});
})

app.post("/",function(req,res){
  var first = req.body.FirstName;
  var last= req.body.LastName;
  var email = req.body.Email;
  var subscribingUser = {
    firstName: first,
    lastName: last,
    email: email
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    //  res.sendFile("success.html",{root:__dirname});
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${
        response.id
      }.`
    );
  }
  //run().catch(e => res.sendFile(__dirname + "/failure.html"));
  run().then(result => {
    res.sendFile("success.html",{root:__dirname});
  }).catch((error) => {
    res.sendFile(__dirname + "/failure.html");
  })

})
