const Meal = require('../models/Meal');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');

exports.add = (req, res, next) => {
    const mealObject = { ...JSON.parse(req.body.meal) }

    Restaurant.findById(req.params.idRes)
    .then(restaurant => {
        // Check if the user have the authorization
        if(restaurant.user != req.auth.userId){
            res.status(400).json({message: "Unauthorized"});
        }

        // Save all thee images in the object
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

        // create a new meal and add it on restaurant
        delete mealObject.restaurant
        const meal = new Meal({
            ...mealObject,
            images: imagesUpload,
            restaurant: req.params.idRes
        });
        meal.save()
        .then(() => res.status(201).json({message: "Meal saved !"}))
        .catch(error => res.status(400).json({error: error.toString()}));
       
    })
    .catch(error => res.status(400).json({error: error.toString()}));
}
// Work here
exports.update = (req, res, next) => {
    const mealObject = req.files ? {
        ...JSON.parse(req.body.meal)
    } : { ...req.body };

    mealObject.images = new Map(Object.entries(mealObject.images));

    Restaurant.findById({_id: req.params.idRes})
    .then(restaurant => {

        // Check if the user have the authorization
        if(restaurant.user != req.auth.userId){
            res.status(400).json({message: "Unauthorized"});
        }

        for(const [_key, image] of mealObject.images.entries()){
            if(!image.isActive){
                const oldFilename = image.url.split('/images')[1];
                fs.unlink(`images/${oldFilename}`, error => { console.log(error) });
                mealObject.images.delete(_key);
            }
        }
        // Save all the new images in the object
        if(req.files){
            for(let file of req.files){
                let img = {
                    url: `${req.protocol}://${req.get('host')}/images/${file.filename}`,
                    isActive: true
                };
                const key = img.url.split('/images/')[1].split('.')[0]
                mealObject.images.set(key, img);
            }
        }
        delete mealObject.restaurant
        Meal.updateOne({_id: req.params.id}, {...mealObject})
        .then(() => res.status(200).json({message: "Meal updated"}))
        .catch(error => res.status(400).json({error: error.toString()}));

    })
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.delete = (req, res, next) => {
    Restaurant.findById({_id: req.params.idRes})
    .then(restaurant => {

        // Check if the user have the authorization
        if(restaurant.user != req.auth.userId){
            res.status(400).json({message: "Unauthorized"});
        }

        Meal.findById({_id: req.params.id})
        .then(meal => {
            meal.images = new Map(Object.entries(meal.images));
            for(const [_key, image] of meal.images.entries()){
                const oldFilename = image.url.split('/images')[1];
                fs.unlink(`images/${oldFilename}`, error => { console.log(error) });
                meal.images.delete(_key);
            }
        });
        
        Meal.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: "Meal deleted !"}))
        .catch(error => res.status(400).json({error: error.toString()}));
    })
    .catch(error => res.status(400).json({error : error.toString()}));
}

exports.findById = (req, res, next) => {
    Meal.findById({_id: req.params.id})
    .populate('restaurant')
    .then(meal => res.status(200).json(meal))
    .catch(error => res.status(400).json({error: error.toString()}));
}

exports.findAll = (req, res, next) => {
    Meal.find()
    .populate('restaurant')
    .then(meals => res.status(200).json(meals))
    .catch(error => res.status(400).json({error: error.toString()}));
}
