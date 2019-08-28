const nodemailer = require('nodemailer')

// verify email
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'ahmadsubhan24@gmail.com',
            clientId: '614123658287-c1biofrpfqcfkkl34k9r8ud77pitud2c.apps.googleusercontent.com',
            clientSecret: 'WybgboCPmAQtRexr8_neurgu',
            refreshToken: '1/bOTPH1EsgMckuXJqakMz5tPjUARzMg7YpX5KNttUSCBetXxtuiBFesvOLp8IqkDi'
        }
    }
)

const mailVerify = (user) => {
    let {name, username, email} = user

    const mail = {
        from: 'Ahmad Subhan <ahmadsubhan24@gmail.com>',
        to: email,
        subject: 'Hello from the other side',
        html: `<h1>HELLO ${name}, ITS MEH</h1>
        <a href='http://localhost:2019/verify?uname=${username}' >Klik untuk verifikasi</a>`
    }
    
    transporter.sendMail(mail, (err, result) => {
        if(err) return console.log(err.message)
    
        console.log('success send email')
    })
}

module.exports = mailVerify