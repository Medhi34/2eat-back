const Appreciation = require('../models/Appreciation');
const Meal = require('../models/Meal');
const Image = require('../models/Image');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const calculator = require('./tools');

exports.create = (req, res, next) => {
    const restaurantObject = req.files ? {
        ...JSON.parse(req.body.restaurant)
    } : { ...req.body }
    delete restaurantObject.user

    let imagesUpload = new Map();
    if(req.files){
        for(let file of req.files){
            let img = {
                url: `${req.protocol}://${req.get('host')}/images/${file.filename}`,
                isActive: true
            };
            const key = img.url.split('/images/')[1].split('.')[0]
            imagesUpload.set(key, img);
        }
    }

    delete restaurantObject.meals;
    const restaurant = new Restaurant({
        ...restaurantObject,
        user: req.auth.userId,
        date_save:  new Date(),
        images: imagesUpload
    });
    restaurant.save()
    .then(restau => res.status(201).json(restau._id))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.findAll = (req, res, next) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    Restaurant.find()
    .then(async restaurants => {
        let results = [];
        for(let rest of restaurants){
            const distance = calculator.distance(rest.localisation.latitude, rest.localisation.longitude, lat, lon);
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
}

exports.findByCategory = (req, res, next) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    Restaurant.find({categories: req.params.category})
    .then(async restaurants => {
        let results = [];
        for(let rest of restaurants){
            const distance = calculator.distance(rest.localisation.latitude, rest.localisation.longitude, lat, lon);
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
}

exports.findByCity = (req, res, next) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    Restaurant.find({'localisation.city': {
        $regex: new RegExp("^" + req.params.city.toLowerCase(), "i")
    }})
    .then(async restaurants => {
        let results = [];
        for(let rest of restaurants){
            const distance = calculator.distance(rest.localisation.latitude, rest.localisation.longitude, lat, lon);
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
}

exports.findbyId = (req, res, next) => {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);

    Restaurant.findOne({_id: req.params.id})
    .then(async restaurant => {
        Appreciation.find({restaurant: restaurant._id})
        .then(async appreciations => {
            const distance = calculator.distance(restaurant.localisation.latitude, restaurant.localisation.longitude, lat, lon);
            restaurant.appreciations = appreciations;
            restaurant.nbVotes = appreciations.length;
            let rate = 0;
            let somme = 0;
            if(appreciations.length != 0){
                for(let app of appreciations){
                    somme += app.note;
                }
                rate = Math.floor(somme / appreciations.length);
            }
            const newItem = {
                restaurant: restaurant,
                distance: distance,
                rate: rate
            }
            res.status(200).json(newItem);
        })
    })
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.update = (req, res, next) => {
    const restaurantObject = {...req.body}
    
    delete restaurantObject.meals
    delete restaurantObject.images
    
    if(restaurantObject.user != req.auth.userId){
        res.status(401).json({message: "Unautorized"});
    }

    Restaurant.updateOne({_id: req.params.id}, {
        ...restaurantObject,
        user: req.auth.userId
    })
    .then(() => res.status(200).json({message: "Restaurant Updated !"}))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.updateImages = (req, res, next) => {
    const restaurantObject = {...JSON.parse(req.body.restaurant)};

    delete restaurantObject.meals
    restaurantObject.images = new Map(restaurantObject.images);
    
    if(restaurantObject.user != req.auth.userId){
        res.status(401).json({message: "Unautorized"});
    }

    for(const [_key, image] of restaurantObject.images.entries()){
        if(!image.isActive){
            const oldFilename = image.url.split('/images')[1];
            fs.unlink(`images/${oldFilename}`, error => { console.log(error) });
            restaurantObject.images.delete(_key);
        }
    }

    for(let file of req.files){
        let img = {
            url: `${req.protocol}://${req.get('host')}/images/${file.filename}`,
            isActive: true
        };
        const key = img.url.split('/images/')[1].split('.')[0]
        restaurantObject.images.set(key, img);
    }

    Restaurant.updateOne({_id: req.params.id}, {
        ...restaurantObject,
        user: req.auth.userId
    })
    .then(() => res.status(200).json({message: "Restaurant Updated !"}))
    .catch(error => res.status(400).json({error: error.toString()}));

}

exports.getMeals = (req, res, next) => {
    Meal.find({restaurant: req.params.id})
    .then(meals => res.status(200).json(meals))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.getAppreciations = (req, res, next) => {
    Appreciation.find({restaurant: req.params.id})
    .populate('user')
    .then(appreciations => res.status(200).json(appreciations))
    .catch(error => res.status(400).json({error: error.toString()}));
}