import nodemailer from 'nodemailer';


export async function sendEmail(options:Record<string, any>) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'fletcher.boyer@ethereal.email',
      pass: '7mxwPHM6EQqVn1pHvB',
    },
  });
  const {name, email} = options;
  const info = await transporter.sendMail({
    from: '"Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: 'Created New Company '+ name, // Subject line
    text: 'New Company Created' +name, // plain text body
    html: `<b>New Company Created ${name}</b>`, // html body
  });

  console.log(info);
  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}


export async function sendUserEmail(options:Record<string, any>) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'fletcher.boyer@ethereal.email',
      pass: '7mxwPHM6EQqVn1pHvB',
    },
  });
  const {name, email} = options;
  const info = await transporter.sendMail({
    from: '"Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: 'Created New Company User'+ name, // Subject line
    text: 'Company Created new User' +name, // plain text body
    html: `<b>Company Created new ${name} user</b>`, // html body
  });

  console.log(info);
  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
