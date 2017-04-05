'use strict';
import express from 'express';
import fs from 'fs';
import neo4j from "neo4j-driver";
import bodyParser from 'body-parser';
import events from 'events';
import Promise from 'promise';
import twilio from 'twilio';
const nodemailer = require('nodemailer');
const uuidV4 = require('uuid/v4');
var app=express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
console.log(uuidV4());
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

