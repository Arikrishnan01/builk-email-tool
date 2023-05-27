const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connecDB = require('./config/db.js');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

/** -------- */
let nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const creds = require('./credential.json');
const cookiParser = require("cookie-parser");


const app = express();
dotenv.config();
app.use(cors());

// MONGODB CONNECTION INJECT
connecDB();

/** ---------- */
const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookiParser());

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));

// TO ACCEPT THE JSON DATA
app.use(express.json());

//  HOME END POINT
app.get('/', (req, res) => {
    res.send("API is Running Successfully");
});


// USER ROUTER
app.use('/api/user', userRoutes);

// ERROR HANDLERS
app.use(notFound);
app.use(errorHandler);

/**nodemailer transpoter */
 let transpoter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 587,
   secure: false,
    auth: {
        user: creds.auth.user,
        pass: creds.auth.pass
    }
 })

app.post('/mail', (req, res, next) => {
    var email = req.body.email
    var message = req.body.message
    var subject = req.body.subject
    var name = req.body.name
    var company = req.body.company

    const mailOptions = {
        from: name,
        to: email,
        subject: subject,
        html: `${name} from ${company} <noreplay@${name}.com> <br /> ${message}`
    }

    transpoter.sendMail(mailOptions, (err, data) => {
        if(err){
            res.json({
                status: err
            })
            console.log(err)
        }
        else{
            res.json({
                status: "success"
            })
            console.log("Email Sent"+ data.response)
        }
    })
})
    transpoter.verify(function(err, success) {
        if(err){
            console.log(err)
        }
        else{
            console.log("Server is ready to take email")
        }
    })


// USING THE DOTENV FOR IMPORT THE PORT 
const PORT = process.env.PORT || 5000

// SERVER LISTEN IN APP
app.listen(PORT, () => {
    console.log(`SERVER STARTED WITH ${PORT}`.yellow.bold);
});





