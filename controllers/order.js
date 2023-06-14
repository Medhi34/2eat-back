const Order = require('../models/Order');

exports.add = (req, res, next) => {
    delete req.body.user
    delete req.body.meal
    const order = new Order({
        ...req.body,
        meal: req.params.mealId,
        user: req.auth.userId,
        date: req.body.date ? new Date(req.body.date) : new Date()
    });

    order.save()
    .then(() => res.status(201).json({message: "Order saved !"}))
    .catch(error => res.status(400).json({error: error.toString()}));
};

exports.update = (req, res, next) => {
    Order.findById({_id: req.params.id})
    .then(order => {
        if(!order) {
            res.status(404).json({message: "Unknown order"});
        }else if(order.user != req.auth.userId){
            res.status(401).json({message: "Unauthorized !"});
        }

        delete req.body.user
        delete req.body.date
        Order.updateOne({_id: req.params.id}, {
            ...req.body,
            user: req.auth.userId
        })
        .then(() => res.status(200).json({message: "Order Updated !"}))
        .catch(error => res.status(400).json({error: error.toString()})); 
    })
       
};

exports.findById = (req, res, next) => {
    Order.findById({_id: req.params.id})
    .populate("meal")
    .then(order => {
        if(!order) {
            res.status(404).json({message: "Unknown order"});
        }else if(order.user != req.auth.userId){
            res.status(401).json({message: "Unauthorized !"});
        }else{
            res.status(200).json(order)
        }
    })
    .catch(error => res.status(400).json({error: error.toString()}));    
};

exports.delete = (req, res, next) => {
    Order.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: "Order Deleted !"}))
    .catch(error => res.status(400).json({error: error.toString()}));    
};