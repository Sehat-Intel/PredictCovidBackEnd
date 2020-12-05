// const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");


const config = require('../config');
const Doctor = require('../models/Doctor');
const Record = require('../models/Record');
const Image = require('../models/Image');
const verifyToken = require('../middlewares/verifyToken')

router.get('/doctors', (req, res) => {
    Doctor.find({}).then(doctors => {
        res.status(200).send(doctors);
    }, err => {
        res.send(err);
    })
});

router.get('/records', verifyToken ,(req, res) => {
   Record.find({}).then((records) => {
       res.status(200).send(records)
   })
})

router.post('/signup', async(req, res) => {
    try{
        console.log('hello')
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)

        const newUser = new Doctor({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email
        });

        console.log(newUser);
        await newUser.save((err, resp) => {
            if(err){
                res.status(200).send(err);
            }
            res.statusCode = 200;
            let token = jwt.sign(newUser.toJSON(), config.token_secret)
            res.status(200).send({token});
        });
    }
    catch(error){
            res.status(400).send(error);
        }
});

router.post('/login', (req, res) => {
    let userData = req.body

    Doctor.findOne({email: userData.email}, async(error, user) => {
        console.log(user)
        if(error){
            res.json(error);
        } else{
            if(!user){
                res.status(401).send({message : 'Invalid email, please sign up'})
            } else{
                try {
                    if(await bcrypt.compare(userData.password, user.password)) {
                        let token = jwt.sign(user.toJSON(), config.token_secret)
                        res.status(200).send({token});
                    } else {
                        res.status(401).send({message : 'Invalid password, please try again'})
                    }
                  } catch (err){
                    res.send(err)
                  }
            }
        }
    })
})



router.get('/records/:id', verifyToken,  (req, res ) => {

    Record.findById(req.params.id, (err, record) => {
        if ( err) {
            res.send(err)
        }
        else{
            res.send(record)
        }

    })
})

router.post('/records/message/:id', verifyToken, (req, res) => {
    Record.findByIdAndUpdate(req.params.id, {
        message: req.body.message
    },  (err, data) => {
        if ( err) {
            res.send(err)
        }
        else{
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: config.email,
                  pass: config.password
                }
              });
            
              // setup email data with unicode symbols
              let mailOptions = {
                  from: 'sehatintel@gmail.com', // sender address
                  to: `${req.body.email}`, // list of receivers
                  subject: 'Sehat Intel message by doctor', // Subject line
                  text: 'Hello world?', // plain text body
                  html: `<h4>Message by the doctor</h4>
                        <p>Message: ${req.body.message}</p>` // html body
              };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.send(error);
                }
                console.log('Message sent: %s', info.messageId);   
                res.json('Message updated. Email sent to the user')
            });
        }

    })
})

router.get('/image/:id', verifyToken ,  (req, res) => {
    console.log(req.params)
    Image.findOne({
        image_id: req.params.id
    }, (err, data) => {
        if(err){
            res.send(err);
        }
        else{
            res.json(data.image);
        }
    })
})



module.exports = router;
