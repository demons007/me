"use strict";
import express from 'express';
import fs from 'fs';
import neo4j from "neo4j-driver";
import bodyParser from 'body-parser';
import events from 'events';
import Promise from 'promise';
import twilio from 'twilio';
const uuidV4 = require('uuid/v4');
const nodemailer = require('nodemailer');
var userMap=new Map();
var redirect = require("express-redirect");
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

var encrypt=(text) => {
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
var decrypt = (text) => {
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
var eventEmitter=new events.EventEmitter();
var eem=() => {
	console.log("eem");
}
eventEmitter.addListener("ok",eem);
eventEmitter.emit("ok")
//console.log(eventEmitter)
var safeEmail= (email) => {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
var safeName=(id) =>
{
    var regex = /^[a-zA-Z ]{2,30}$/;
	return regex.test(id);
}
var safePassword = (password) => {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(password);
}
var safeMobile = (mob) => {
    var pattern = new RegExp("^[0-9]{10}$");
    return pattern.test(mob);
}
var safefy = (ob) => {
	let mp=new Map();
	mp.set("name",false);
	mp.set("email",false);
	mp.set("password",false);
	if(ob.email.indexOf('@')>0){
		console.log(ob.email);
		if(safeEmail(ob.email)){
			mp.set('email',true);
		}
	}else{
		if(safeMobile(ob.email)){
			mp.set('email',true);
		}
	}
	
	if(safeName(ob.name)){
		mp.set('name',true);
	}
	if(safePassword(ob.password)){
		mp.set('password',true);
	}
	return mp;
}
/*var otp = () => {
	return Math.floor(100000 + Math.random() * 900000);
}*/
var otp = () => {
    return new Promise((resolve, reject) => { // (A)
         resolve(Math.floor(100000 + Math.random() * 900000));// (B)
    });
}
var sendOtp= (no) => {
var client = twilio('AC13c142cc4ef2d2f65314c7157e111b0f', '6c22f73ee2094dac2f5f3cc6340746de');
client.sendMessage({to: '+919831296420',from: '+12053407042',body: `While signimg up you need otp. OTP is - ${no}`},(error) =>{
	if(error){
		throw error;
	}
	console.log("sent");
});
}
eventEmitter.addListener("otpSend",sendOtp);
var sendMailAj= (data,to,subject) => {
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ajaykrjha93@gmail.com',
        pass: 'shrey@jh@93'
    }
});
let mailOptions = {
    from: '"ajay " <ajaykrjha93@gmail.com>', // sender address
    to: `${to}` ,// list of receivers
    subject: `${subject}`, // Subject line
    text: `while signing in you need otp. OTP is - ${data}`, // plain text body
    html: `<b>while signing in you need otp. OTP is - <a href="#">${data}</a></b>` // html body
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
}
eventEmitter.addListener("sendMailToAj",sendMailAj)
//console.log(otp())
let h=fs.readFileSync(__dirname+'/public/lfLogin.html');
let s=fs.readFileSync(__dirname+'/public/lfS.html');
var m=new Map();
m.set('login',h);
m.set('home',s);
var app=express();
redirect(app);
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());


app.get('/',(req,res) => {
	res.write(m.get('login').toString());
	res.end();
})

app.get('/testing',function(req,res){
	let p=req.query.mn;
	console.log(p)
	let driver = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let session = driver.session();
		session
			.run(`Match (ee:Rita) where ee.email = "${p}" return ee as USER`)
			.then( function(result){
					console.log(result.records[0].get("USER"));

					//res.write(result.records[0]);
					res.end();
			})
})

var red=(em) => {
	let driverY = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let sessionY = driverY.session();
		sessionY
			.run(`Match (ee:Rita) where ee.email = "${em}" remove ee.otp return ee.email as email`)
			.then( function(resultY){
				console.log("ho")
				let enc=encrypt(em);
			app.redirect("/otpAuth", `/lfS?l_v=${enc}`, 301);
			}).catch((e) => {
				console.log(e);
			})
}
eventEmitter.addListener("ll",red)
app.get('/lfS',(req,res) => {
	res.write(m.get('home').toString());
	res.end();
})

app.get('/linkMyFace',(req,res) => {
	console.log(req.query.s_a);
	res.end();
})

app.get('/songs',(req,res) => {
	console.log(req.query.s_a)
	let vc=req.query.s_a;
	let driverX = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let sessionX = driverX.session();
		sessionX
			.run("Match (ee:Video) where ee.name=~'"+".*."+vc+".*' return ee.name as songs")
			.then( function(resultX){
				console.log("test data")
				console.log(resultX.records);
				let ar=[];
				for(let i of resultX.records){
					ar.push(i.get("songs"))
				}
				console.log(ar);
				res.setHeader("Content-Type", "application/json");
				res.write(JSON.stringify({ob:ar}));
				res.end();
				driverX.close();
				sessionX.close();
			}).catch((e)=>{
				console.log(e);
			})
			
})

app.get('/playlist',(req,res) => {
	console.log(req.query.l_v)
	let vc=req.query.l_v;
	let driverX = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let sessionX = driverX.session();
		sessionX
			.run(`Match (ee:Rita)-[:HAS_VIDEO]->(ff:Video) where ee.email = "${vc}" return ff.name as songs`)
			.then( function(resultX){
				console.log(resultX.records);
				let ar=[];
				for(let i of resultX.records){
					ar.push(i.get("songs"))
				}
				console.log(ar);
				res.setHeader("Content-Type", "application/json");
				res.write(JSON.stringify({ob:ar}));
				res.end();
				driverX.close();
				sessionX.close();
			}).catch((e)=>{
				console.log(e);
			})
			
})
app.get('/MyLf',(req,res) => {
	var em=JSON.parse(req.query.ref).email;
	//console.log(em)
	let inMapMyLf=[];
	let driverX = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let sessionX = driverX.session();
		sessionX
			.run(`Match (ee:Rita)-[:LINKED]-(ff) where ee.email = "${em}" return ff.name as name,ff.email as email`)
			.then( function(resultX){
				resultX.records.map( (a,b) =>{
					inMapMyLf.push({name:a.get('name'),email:a.get('email')});
				} )
				console.log(inMapMyLf)
				res.setHeader("Content-Type", "application/json");
				res.write(JSON.stringify({data:inMapMyLf}));
				res.end();
				driverX.close();
				sessionX.close();
			})
			.catch(function(e){console.log(e)});

})
app.post('/otpAuth',(req,res) => {
	console.log(req.body.to)
		let em=req.body.to;
		let otp=req.body.otp;
		console.log(otp)
			let driverX = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let sessionX = driverX.session();
		sessionX
			.run(`Match (ee:Rita) where ee.email = "${em}" return ee.otp as OTP`)
			.then( function(resultX){
				console.log(resultX.records[0].get("OTP"))
				if(resultX.records[0].get("OTP")==otp){
					//eventEmitter.emit("ll",otp)
						let driverY = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let sessionY = driverY.session();
		sessionY
			.run(`Match (ee:Rita) where ee.email = "${em}" remove ee.otp return ee.email as email`)
			.then( function(resultY){
				console.log("ho")
				let enc=encrypt(em);
				console.log(decrypt(enc))
			//app.redirect("/otpAuth", "/lfS?l_v=${enc}", 301);
			res.write(`/lfS?l_v=${enc}`);
			res.end();
			}).catch((e) => {
				console.log(e);
			})
				}
			})
})

app.post('/signAuth',(req,res) => {

let body = req.body;
let valid=safefy(req.body);
if(valid.get('email') && valid.get('name') && valid.get('password')){
	otp().then(result => {
		let encryptOTP=encrypt(result.toString());
		let driver = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let session = driver.session();
		session
			.run(`Match (ee:Rita) where ee.email = "${body.email}" return ee.email as USER,ee.otp as OTP`)
			.then( function(result1){
				console.log(result1.records[0])
				if(typeof result1.records[0]== "undefined"){
					console.log(result1.records[0])
					let driver1 = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
					let session1 = driver.session();
					session1.run("CREATE (ee:Rita {name: {name},email:{email},password:{password},gender:{gender},dob:{dob},interest:{interest},otp:{otp}}) RETURN ee.otp AS otp", {name: body.name,email:body.email,password:body.password,gender:body.gender,dob:body.dob,interest:body.interest,otp:encryptOTP})
					.then(function(){
						if(body.email.indexOf('@')>0){
							eventEmitter.emit("sendMailToAj",encryptOTP,body.email,"OTP")
						}else{
							eventEmitter.emit("otpSend",encryptOTP)
						}
						res.setHeader("Content-Type", "text/plain");
						res.write("otp sent");
						res.end();

					})
				}
				else{
					console.log(result1.records[0])

					console.log(result1.records[0].get("OTP"))
					if(result1.records[0].get("USER") !== "undefined" && result1.records[0].get("OTP") !== null ){
					res.setHeader("Content-Type", "text/plain");
					res.write("existing otp");
					res.end();
				}else
				{
					res.setHeader("Content-Type", "text/plain");
					res.write("existing user");
					res.end();
				}
				//-----------------
					setTimeout(function(){
  					let driver2 = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
					let session2 = driver.session();
					session2.run(`Match (ee:Rita) where ee.email = "${body.email}" return ee.otp as OTP`)
					.then(function(result5){
						if(result5.records[0].get("OTP") !== null){
							return session.run(`Match (ee:Rita) where ee.email = "${body.email}" detach delete ee`);
						}
						
					}).then(function(res){
						session.close();
    					driver.close();
					})

  				},300000)

					//--------
				}

			})
	})
}

})

/*app.post('/signAuth',(req,res) => {
let bo=req.body;
let mn=safefy(req.body);
console.log(mn)
//console.log(encrypt())
if(mn.get('email') && mn.get('name') && mn.get('password')){
	otp().then(result => {
		console.log("e")
		let ot=result;
		console.log(ot)
		let mb=encrypt(ot.toString());
		console.log(mb);
		if(bo.email.indexOf('@')>0){
			eventEmitter.emit("sendMailToAj",mb,bo.email,"OTP")
		}else{
			eventEmitter.emit("otpSend",mb)
		}
		let driver = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
		let session = driver.session();
		session
			.run(`Match (ee:Rita) where ee.email = ${bo.email} return ee.otp as OTP`)
  			.then( function(result)
  			{
				if(result.records[0] !== "undefined"){
				//console.log(result.records[0].get("otp"));

				return session.run( "CREATE (ee:Rita {name: {name},email:{email},password:{password},gender:{gender},dob:{dob},interest:{interest},otp:{otp}}) RETURN ee.otp AS otp", {name: bo.name,email:bo.email,password:bo.password,gender:bo.gender,dob:bo.dob,interest:bo.interest,otp:mb})
				
				}else{
					res.setHeader("Content-Type", "text/plain");
					res.write("otp");

				}
				
				res.end();
				//res.end();
    			session.close();
    			driver.close();
  			}).then((re)=>{
  				if(typeof re=="object" && re=='null'){

  				}
  				res.write("lolwa");
  				res.end();
  				setTimeout(function(){
  					let driver = neo4j.driver("bolt://hobby-panhpmpgjildgbkepcdcklol.dbs.graphenedb.com:24786", neo4j.auth.basic("rita", "b.PuhuqVThYfCn.fvurl1e25g7fzyCI"));
					let session = driver.session();
					session.run(`Match (ee:Rita) where ee.email = ${bo.email} return ee.otp as OTP`)
					.then(function(result){
						console.log(result.records[0].get("OTP"))
						if(result.records[0] == "undefined"){
							return session.run(`Match (ee:Rita) where ee.email = ${bo.email} detach delete ee`);
						}
					}).then(function(){

					})

  				}.bind({email:bo.email}),3000)
  			})
  			.catch((e) => {
  			console.log(e)
  			});
	}).catch((e) => {
		console.log("html")
		console.log(e);

	});
}else{
	res.write("otp1");
	res.end();
  //res.end();
}
})
*/
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

