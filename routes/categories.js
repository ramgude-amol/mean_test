const express = require('express');
const router = express.Router();
const category = require('../models/Categories');
const counters = require('../models/Counters');
const subcategories = require('../models/SubCategories');

/* get category details
 http://localhost:3000/api/categories/details/1 */
router.get('/detail/:id', async (req, res) => {

    if (req.params.id == null || isNaN(req.params.id)) {
        res.send({message: "invalid Id , Please provide valid integer value of category id"});
    }

    let id = parseInt(req.params.id);

    const p = await category.findOne({id: req.params.id});
    if( p != null && p.id != null )
    {
      var categor_details = {id:p.id,title:p.category_title,description:p.categ_desc};
      res.send({message: "category found successfully.", category_detail: categor_details});
    }else {
      res.send({message: "No category found with id: "+`${id}`});
    }

});


/* find all categories with children
http://localhost:3000/api/categories/getAll */
router.get('/getAll', async (req, res, childs) => {


  const allcateg = await category.find();
  if( allcateg != null )
  {
    var categories = [];
    for (var v of allcateg) {
       var subcat = await subcategories.find({parent_category_id:v.id});
      if(subcat !=null)
      {
          var childs=[];

          for(var s of subcat)
          {
            childs.push (s.category_id);
          }

          categories.push({'id':v.id,title:v.category_title,'child_categories': childs});

      }
    }

    res.send({result:true,categories:categories});
  }else {
    res.send({message: "No category found",result:false});
  }

});



/*in add new category
 post http://localhost:3000/api/categories/new?title=test123&description=test desc */
router.post('/new', async (req, res) => {

    if(req.query.title == null || req.query.description == null )
    {
        res.send({message: "Please provide valid strings for category title and description"});
    }

    try {
        const c = await counters.findOneAndUpdate({_id: 'category_id'}, {$inc: {sequence_value: 1}});

        const p = new category({
            id : c.sequence_value,
            'category_title': req.query.title,
            'categ_desc': req.query.description,
            "createdAt": new Date()
        })

        await p.save();

        if (p._id != null) {
            res.send({message: "New category Added", category_id: p.id});
        }
    } catch (e) {
        res.send({message: "Unable to add Category", "validation errors": e.message});
    }

});

module.exports = router;
