'use strict';
import express from 'express';
import fs from 'fs';
let h=fs.readFileSync(__dirname+'/public/lfLogin.html');
var m=new Map();
m.set('login',h);
//delete h;
var app=express();
app.use(express.static(__dirname + '/public'));


app.get('/',(req,res) => {
	res.write(m.get('login').toString());
	res.end();
})


app.listen('3000',() => {
	console.log("hi");
})
