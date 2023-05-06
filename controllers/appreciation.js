const Appreciation = require('../models/Appreciation');

exports.add = (req, res, next) => {
    delete req.body.user
    const appreciation = new Appreciation({
        ...req.body,
        user: req.auth.userId,
        date: req.body.date ? new Date(req.body.date) : new Date()
    });
    appreciation.save()
    .then(() => res.status(201).json({message: "Appreciation save !"}))
    .catch(error => res.status(400).json({error: error.toString()}));
};

exports.update = (req, res, next) => {
    Appreciation.findById({_id: req.params.id})
    .then(appreciation => {
        if(appreciation.user != req.auth.userId){
            res.status(401).json({message: "Unauthorized"});
        }

        delete req.body.user;
        Appreciation.updateOne({_id: req.params.id}, {
            ...req.body,
            user: req.auth.userId,
            date: new Date()
        })
        .then(() => res.status(200).json({message: "Appreciation updated !"}))
        .catch(error => res.status(400).json({error: error.toString()}));
    })
    .catch(error => res.status(400).json({error: error.toString()}));

};

exports.find = (req, res, next) => {
    Appreciation.findById({_id: req.params.id})
    .populate('user')
    .then(appreciation => res.status(200).json(appreciation))
    .catch(error => res.status(400).json({error: error.toString()}));
};

exports.delete = (req, res, next) => {
    Appreciation.findById({_id: req.params.id})
    .then(appreciation => {
        if(appreciation.user != req.auth.userId){
            res.status(400).json({message: "Unauthorized"});
        }

        Appreciation.deleteOne({_id: req.params.id})
        .then(() => res.status(200).json({message: "Appreciation deleted !"}))
        .catch(error => res.status(400).json({error: error.toString()}));
    })
    .catch(error => res.status(400).json({error: error.toString()}));
};