const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const calculator = require('./tools');

exports.signup = (req, res, next) => {
    const userObject = req.file ? {
        ...JSON.parse(req.body.user)
    } : {...req.body};

    bcrypt.hash(userObject.password, 10)
    .then(hash => {
        delete userObject.password
        delete userObject.imageUrl
        const user = new User({
            ...userObject,
            password: hash,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : ''
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({error : error.toString()}));
    })
    .catch(error => res.status(500).json({error: error.toString()}));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(401).json({message: "Incorrect email or password"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({message: "Incorrect email or password"});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    'PICK_UP_YOUR_FEELINGS_',
                    {}
                )
            });
        })
        .catch(error => res.status(500).json({error: error.toString()}));
    })
    .catch(error => res.status(500).json({error: error.toString()}));
};

exports.findById = (req, res, next) => {
    User.findById({_id: req.params.id})
    .then(user => res.status(200).json(user))
    .catch(error => res.status(400).json({error: error.toString()}));
};

exports.updateImage = (req, res, next) => {
    const userObject = { ...JSON.parse(req.body.user) };

    delete userObject._id
    delete userObject.password
    

    if(userObject.imageUrl != ''){
        const oldFilename = userObject.imageUrl.split('/images')[1];
        fs.unlink(`images/${oldFilename}`, error => { console.log(error) });  
    }

    User.updateOne({_id: req.params.id}, {
        ...userObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    .then(() => res.status(200).json({message: "Update done !"}))
    .catch(error => res.status(400).json({error: error.toString()}));
    
}

exports.update = (req, res, next) => {
    const userObject = { ...req.body };
    delete userObject._id
    delete userObject.imageUrl

    User.updateOne({_id: req.params.id}, {
        ...userObject,
    })
    .then(() => res.status(200).json({message: "Update done !"}))
    .catch(error => res.status(400).json({error: error.toString()}));
    
}

exports.delete = (req, res, next) => {
    User.findById({_id: req.params.id})
    .then(user => {
        const filename = user.imageUrl.split('/images')[1];
        fs.unlink(`images/${filename}`, () => {
            User.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Delete done !"}))
            .catch(error => res.status(400).json({error: error.toString}));
        })        
    })
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.getRestaurants = (req, res, next) => {
    User.findById({_id: req.params.id})
    .then(user => {
        Restaurant.find({user: req.params.id})
        .then(async restaurants => {
            let results = [];
            for(let rest of restaurants){
                const distance = calculator.distance(rest.localisation.latitude, rest.localisation.longitude, user.localisation.latitude, user.localisation.longitude);
                await calculator.rating(rest._id).then(rate => {
                    const newItem = {
                        restaurant: rest,
                        distance: distance,
                        rate: rate
                    }
                    results.push(newItem);
                });
            }
            results = results.sort((a, b) => a.distance - b.distance);
            res.status(200).json(results)
        })
        .catch(error => res.status(400).json({error: error.toString()}));
    })
    .catch(error => res.status(400).json({error: error.toString()}));
    
}

exports.getOrders = (req, res, next) => {
    Order.find({user: req.params.id})
    .populate("meal")
    .then(orders => res.status(200).json(orders))
    .catch(error => res.status(400).json({error: error.toString()}));
}
