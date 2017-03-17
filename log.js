'use strict';
import express from 'express';
import fs from 'fs';
import neo4j from "neo4j-driver";
import bodyParser from 'body-parser';
var safeEmail= (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function safeName(id)
{
    var regex = /^[a-zA-Z ]{2,30}$/;
	return regex.test(id)
}
function safePassword(password) {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(password);
}
function safeMobile(mob) {
    var pattern = new RegExp("^[0-9]{10}$");
    return pattern.test(mob);
}
var safefy = (ob) => {
	let mp=new Map();
	//let oc={name:false,email:false,password:false,gender:false,dob:false,interest:false}
	mp.set("name",false);
	mp.set("email",false)
	mp.set("password",false)
	if(safeEmail(ob.email)){
		let mc=mp.set('email',true)
	}
	if(safeName(ob.email)){
		let mc=mp.set('name',true)
	}
	if(safePassword(ob.email)){
		let mc=mp.set('password',true)
	}
	//console.log(mp.get('email'));
	//safeEmail(ob.email):mp.set(mp.get('all').email,true)?mp.set(mp.get('all').emial,true);
	//console.log(mp.get('all').email);
	return mp;
}
let h=fs.readFileSync(__dirname+'/public/lfLogin.html');
let s=fs.readFileSync(__dirname+'/public/lfS.html');
var m=new Map();
m.set('login',h);
m.set('home',s);
//delete h;
var app=express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/',(req,res) => {
	res.write(m.get('login').toString());
	res.end();
})

app.post('/signAuth',(req,res) => {

//console.log(safeEmail(req.body.email));
//console.log(safePassword(req.body.password));
let mn=safefy(req.body);
console.log(mn.get('email'))
/*let driver = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
let session = driver.session();
session
  .run( "CREATE (a:Person {name: {name}, title: {title}})", {name: "Arthur", title: "King"})
  .then( function()
  {

    session.close();
    driver.close();
  });*/
  //res.end();
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

