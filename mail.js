'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ajaykrjha93@gmail.com',
        pass: 'shrey@jh@93'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"ajay " <ajaykrjha93@gmail.com>', // sender address
    to: 'ajaykrjha93@gmail.com' ,// list of receivers
    subject: 'Hello ?', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});