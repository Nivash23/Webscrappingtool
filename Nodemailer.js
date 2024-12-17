const nodemailer = require('nodemailer');


    // const { email, name, Subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'billanivash52@gmail.com',
            pass: 'pdwztlfkgtwngutc'
        }
    });
    
module.exports = transporter;
    