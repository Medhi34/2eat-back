const Appreciation = require('../models/Appreciation');
const Meal = require('../models/Meal');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');

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
    .then(() => res.status(201).json({message: "Restaurant enregistré !"}))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.findAll = (req, res, next) => {
    Restaurant.find()
    .then(restaurants => res.status(200).json(restaurants))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.findByCategory = (req, res, next) => {
    Restaurant.find({categories: req.params.category})
    .then(restaurants => res.status(200).json(restaurants))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.findByCity = (req, res, next) => {
    Restaurant.find({'localisation.city': req.params.city})
    .then(restaurants => res.status(200).json(restaurants))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.findbyId = (req, res, next) => {
    Restaurant.findOne({_id: req.params.id})
    .then(restaurant => {
        Appreciation.find({restaurant: restaurant._id})
        .then(appreciations => {
            restaurant.appreciations = appreciations;
            res.status(200).json(restaurant)
        })
    })
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.update = (req, res, next) => {
    const restaurantObject = req.files ? {
        ...JSON.parse(req.body.restaurant)
    } : { ...req.body }
    
    delete restaurantObject.meals
    restaurantObject.images = new Map(Object.entries(restaurantObject.images));
    
    if(restaurantObject.user != req.auth.userId){
        res.status(400).json({message: "Unautorized"});
    }

    for(const [_key, image] of restaurantObject.images.entries()){
        if(!image.isActive){
            const oldFilename = image.url.split('/images')[1];
            fs.unlink(`images/${oldFilename}`, error => { console.log(error) });
            restaurantObject.images.delete(_key);
        }
    }
    if(req.files){
        for(let file of req.files){
            let img = {
                url: `${req.protocol}://${req.get('host')}/images/${file.filename}`,
                isActive: true
            };
            const key = img.url.split('/images/')[1].split('.')[0]
            restaurantObject.images.set(key, img);
        }
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
