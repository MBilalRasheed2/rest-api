const Category = require("../models/category");
const slugify = require("slugify");
const path = require('path');
const fs = require('fs');
exports.createCategory = (req, res) => {

  const { name } = req.body;
  const slug = slugify(name);

  const CatObj = {
    name: name,
    slug: slug,
  };
  if (req.file) {

    CatObj.categoryImage = req.file.filename;
  }
  if (req.body.parentId) {
    CatObj.parentId = req.body.parentId;
  }
  if (req.body.type) {
    CatObj.type = req.body.type;
  }
  const cat = new Category(CatObj);

  cat.save((error, category) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (category) {
      return res.status(200).json({ category });
    }
  });
};
function arrangeCategories(categories, parentId = null) {
  let category;
  let mycategories = [];

  if (parentId == null) {
    category = categories.filter((f) => f.parentId == undefined);
  } else {
    category = categories.filter((f) => f.parentId == parentId);
  }
  for (let cat of category) {
    mycategories.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      children: arrangeCategories(categories, cat._id),
    });
  }
  return mycategories;
}
exports.getAllCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({ message: error });
    }
    if (categories) {
      const getAll = arrangeCategories(categories);
      return res.status(200).json({ getAll });
    }
  });
};
exports.deleteCategory = (req, res) => {
  const { _id } = req.body;

  Category.findByIdAndDelete(_id).exec((error, category) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (category) {
      const makpath = path.join(path.dirname(__dirname), `uploads/${category.categoryImage}`);
      if (fs.existsSync(makpath)) {
        fs.unlink(makpath);
      }

    }
  });
}
exports.updateCategory = (req, res) => {
  const { _id, name } = req.body;
  const categoryObj = { name: name, slug: slugify(name) };


  if (req.file) {
    categoryObj.categoryImage = req.file.filename
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  Category.findByIdAndUpdate(_id, categoryObj).exec((error, category) => {

    if (error) {
      return res.status(400).json({ message: error });
    }
    if (category) {
      if (categoryObj.categoryImage) {
        if (category.categoryImage) {
          const makePath = path.join(path.dirname(__dirname),`uploads/${category.categoryImage}`);

          
          if (fs.existsSync(makePath)) {
            fs.unlink(makePath, (err) => {
              if (err) {
                console.log(err)
              }
            })
          } else {
            console.log("image not found");
          }
        }
      }
      return res.status(200).json({ category });
    }



  })
}