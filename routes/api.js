// const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = require('express').Router();
const jwt = require('jsonwebtoken');


const config = require('../config');
const Doctor = require('../models/Doctor');
const Record = require('../models/Record');
const Image = require('../models/Image');
const verifyToken = require('../middlewares/verifyToken')

router.get('/doctors', (req, res) => {
    Doctor.find({}).then(doctors => {
        res.send(doctors);
    })
});


router.get('/records', verifyToken ,(req, res) => {
   Record.find({}).then((records) => {
       res.send(records)
   })
})

router.post('/signup', async(req, res) => {
    console.log('post called')
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
        let savedUser = await newUser.save();
        res.statusCode = 200;
        let token = jwt.sign(newUser.toJSON(), config.token_secret)
        res.status(200).send({token});

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
            console.error();
            res.json(error);
        } else{
            if(!user){
                res.status(401).send({message : 'Invalid Email'})
            } else{
                try {
                    if(await bcrypt.compare(userData.password, user.password)) {
                        let token = jwt.sign(user.toJSON(), config.token_secret)
                        res.status(200).send({token});
                    } else {
                        res.status(401).send({message : 'Invalid password'})
                    }
                  } catch (err){
                    console.log(err)
                  }
            }
        }
    })
})

router.get('/records/:id', (req, res ) => {

    Record.findById(req.params.id, (err, record) => {
        if ( err) {
            res.send(err)
        }
        else{
            res.send(record)
        }

    })
})

router.post('/records/:id', (req, res) => {
    Record.findByIdAndUpdate(req.params.id, {
        message: req.body.message
    },  (err, record) => {
        if ( err) {
            res.send(err)
        }
        else{
            res.json("Message Updated")
        }

    })
})

router.get('/image/:id',  (req, res) => {
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


// router.get('/users', (req, res) => {
//     User.find({}).then((users) => {
//         res.send(users)
//     })
// });

// router.get('/image', (req, res) => {
//     Image.find({}, (images, err) => {
//         if(images){
//             res.json(images)
//         } 
//         else{
//             res.json(err)
//         }
//     })
// })

// function verifyToken(req, res, next)  {
//     console.log('inside verify token')
//     if(!req.headers.authorization ){
//         return res.status(401).send("No token passed")
//     }

//     let token = req.headers.authorization.split(' ')[1]
//     if (token === 'null'){
//         return res.status(401).send("Extracted Token is Null")
//     }
//     let payload = jwt.verify(token, config.token_secret)
//     if (!payload){
//         console.log(payload)
//         return res.status(401).send("Unauthorized request")
//     }
//     req.userId = payload.subject
//     next()  

// }
