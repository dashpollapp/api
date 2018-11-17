import nodemailer from 'nodemailer';

export default function deleteUser(req, res, next){

    var transporter = nodemailer.createTransport({
      host: "dashpoll.net", // hostname
      secure: false, // use SSL
      port: 25, // port for secure SMTP
      auth: {
          user: "no-reply@dashpoll.net",
          pass: "K3fU4kmJPx668dDe"
      },
      tls: {
          rejectUnauthorized: false
      }
    });

    var mailOptions = {
      from: '"Dashpoll " <no-reply@dashpoll.net>',
      to: 'luca@dashpoll.net',
      subject: 'Account Löschen',
      html: `
      <div style="width: 100%; height: 300; padding: 0; margin: 0">

      <div style="height: 50; width: 100%; background-color: #eee">
      
      <center>

      <img style="height: 50; width: 100; sry="https://dashpoll.net/logo.png" />

      </center>
      
      </div>

      <center>

      <a style="color: green" href='https://dashpoll.net'>${req.user.username}</a>

      <center>
      
      </div>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

