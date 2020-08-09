const express = require('express');
const router = express.Router();
const products = require("../models/Products");
const categories = require("../models/Categories");
const prodcategories = require("../models/ProductCategories");
const counters = require("../models/Counters");

/* add new product
in post http://localhost:3000/api/products/new?product_title=1st title&prod_desc=1st product description&price=777 */
router.post('/new', async function (req, res, next) {

    if(req.query.product_title == null || req.query.prod_desc == null || req.query.price == null)
    {
        res.send({message: "Please provide valid string for product_title/product_desc/price",'error':true});
    }

    try {
        const c = await counters.findOneAndUpdate({_id: 'product_id'}, {$inc: {sequence_value: 1}});

        const p = new products({
            id : c.sequence_value,
            'product_title': req.query.product_title,
            'prod_desc': req.query.prod_desc,
            'price': parseInt(req.query.price),
            "createdAt": new Date()
        })
        await p.save(err => {
            if (err) return res.status(500).send({message: "Unable to add Product", "validation errors": err.message});
            return res.send({message: "New product Added", product_id: p.id});
        });


    } catch (e) {
        res.send({message: "Unable to add Product", "validation errors": e.message});
    }
});

/* Map product to categories
in post http://localhost:3000/api/products/productCategoryMapping/?pid=3&categories=[4] */
router.post('/productCategoryMapping', async function (req, res, next) {

    const prod_id = req.query.pid;
    const category_id_list = req.query.categories;
    // find product in db
    try {
        const p = await products.find({id: prod_id});

    } catch (e) {
        res.status(200).json({"message": "product not found with id :" + `${prod_id}`})
    }

    // find categories in db
    try {
        var categ = JSON.parse(category_id_list);
        var category_arr = [];
        var i = 0;
        for (const c_id of categ) {
            category_arr[i] = (await categories.find({id: c_id}));

            if (category_arr[i] != null) {
                try {
                    const pc = new prodcategories({
                        product_id: prod_id,
                        category_id: c_id
                    });
                   await pc.save(err => {
                       if (err) return res.status(500).send(err);
                   });
                } catch (e) {
                    res.status(200).json({"message": "unable to map product to categories due to errors :" + `${e.message}`})
                }
            }

            i++;
        }


        res.status(200).json({"message": "Product is mapped to categories"})

    } catch (e) {
        res.status(200).json({"message": "unable to find categories with id :" + `${e}`})
    }
});

/*
find all products from category
 http://localhost:3000/api/products/getAllByCategory/1 */
router.get('/getAllByCategory/:category_id', async (req, res, childs) => {

    let id = req.params.category_id;
    if(req.params.category_id == null )
    {
        res.status(200).json({"message": "unable to find categories with id :" + `${e}`})
    }
    const categ = await categories.findOne({'id':id});
    if( categ != null )
    {

        const prods_ids = await prodcategories.find({'category_id':id});

        var prod_list = [];
        for(var pid of prods_ids)
        {
            var prod = await products.findOne({'id' : pid.product_id});

            if(prod != null)
            {
                prod_list.push({id:prod.id,title:prod.product_title});
            }
        }
        res.send({category:{'id':categ.id,'title':categ.category_title},products:prod_list});
    }else {
        res.send({message: "No category found with id: "+`${id}`});
    }

});

/*
update product details
in post http://localhost:3000/api/products/productupdate?product_title=1st title&prod_desc=1st product description&price=777 */
router.post('/productupdate', async function (req, res, next) {

    if(req.query.id == null)
    {
        res.send({message: "Kindly provide valid product id" });
    }

    var set = {};
    if(req.query.product_title != null )
    {
        set.product_title = req.query.product_title;
    }
    if(req.query.price != null)
    {
        set.price = req.query.price;
    }
    if(req.query.description != null)
    {
        set.prod_desc = req.query.description;
    }

    let id = req.query.id;
    try {
         await products.findOneAndUpdate({id: id }, {$set: set });

        res.send({message: "product updated successfully", product_id: id});
    } catch (e) {
        res.send({message: "Unable to add Product", "validation errors": e.message});
    }
});


module.exports = router;
