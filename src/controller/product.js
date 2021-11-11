const Product = require('../models/product');
const Category = require('../models/category');
const fs = require("fs");
const path = require("path");
const slugify = require('slugify')
exports.productCreate = (req, res) => {
    const { category, description, quantity, price, name, offer, review } = req.body;
    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename };
        });
    }
    const product = new Product({
        name,
        slug: slugify(name),
        price,
        quantity,
        description,
        offer,
        productPictures,
        review,
        category,
        createdBy: req.user._id
    });
    product.save((err, data) => {
        if (err) {
            return res.status(400).json({ err });
        }
        if (data) {
            return res.status(200).json({ product: data });
        }
    })
    //  return res.status(200).json({ product });

};

exports.getAllProducts = (req, res) => {

    Product.find({}).populate('category', '_id name').exec((error, product) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (product) {
            return res.status(200).json({ product });
        } else {
            return res.status(400).json({ err: "product not found" });
        }
    })
}
exports.getSingleProduct = (req, res) => {
    const { productId } = req.params;
    Product.findOne({ _id: productId }).exec((error, product) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (product) {
            return res.status(200).json({ product });
        } else {
            return res.status(400).json({ err: "product not found" });
        }
    })
}


exports.getProductBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug }).select('_id').exec((error, category) => {

        if (error) {
            return res.status(400).json({ error });
        }
        Product.find({ category: category._id }).exec((pError, product) => {

            if (pError) {
                return res.status(400).json({ pError });
            }
            if (product) {

                return res.status(200).json({ product });
            }

        })

    })
}

exports.getProductsByCategory = (req, res) => {
    const { category } = req.params;
    Category.find({}).exec((error, categories) => {
        const cNC = creatNewCate(categories);
        const getChils = createChils(cNC, category)

        try {
            Product.find({ category: { $in: getChils } }).exec(async (err, pro) => {
                if (err) {
                    return res.status(400).json({ err })
                }
                if (pro) {
                    let newProductData = [];
                    pro.map(pr => {
                        const pId = pr.category.toString();
                        categories.map(ca => {
                            const cId = ca._id.toString()
                            if (pId == cId) {
                                newProductData.push({
                                    _id: pr._id,
                                    name: pr.name,
                                    slug: pr.slug,
                                    price: pr.price,
                                    description: pr.description,
                                    offer: pr.offer,
                                    productPictures: pr.productPictures,
                                    review: pr.review,
                                    category: pr.category,
                                    categorySLug: ca.slug
                                })
                            }
                        })
                    })

                    return res.status(200).json({ Products: newProductData })
                }
            })

        } catch (err) {
            console.log(err)
        }
    });

}

exports.getProductsBySubCategory = (req, res) => {
    const { category } = req.params;

    Category.find({}).exec((error, categories) => {

        const makeCat = creatNewCate(categories);

        const makeChild = createSubChils(makeCat, category);

        Product.find({ category: { $in: makeChild } }).exec((err, pro) => {
            return res.status(200).json({ Products: pro })
        });

    });


}

exports.getProductUpdate = (req, res) => {
    const { _id, name, price, quantity, description, category, offer } = req.body;
    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map((file) => {
            return { img: file.filename }
        });
    }

    Product.findOneAndUpdate({ _id: _id }, {
        name: name,
        slug: slugify(name),
        price: price,
        quantity: quantity,
        description: description,
        category: category,
        offer: offer,
        productPictures,
        createdBy: req.user._id
    }, (error, product) => {
        if (productPictures.length > 0) {
            product.productPictures.map(m => {
                const makePath = path.join(path.dirname(__dirname), `uploads/${m.img}`);
                if (fs.existsSync(makePath)) {
                    fs.unlink(makePath, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }

            })
        }
        return res.status(200).json({ product });
    })
}

exports.getProductDelete = (req, res) => {
    const { deleteId } = req.params;
    Product.findOneAndDelete({ _id: deleteId }, (error, product) => {
        if (product.productPictures.length > 0) {
            product.productPictures.map(m => {
                const makePath = path.join(path.dirname(__dirname), `uploads/${m.img}`);
                if (fs.existsSync(makePath)) {
                    fs.unlink(makePath, (err) => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }

            })
        }
        return res.status(200).json({ message: "deleted", product });
    })
}
const creatNewCate = (categories, parentId = null) => {
    let category
    let myCat = [];
    if (parentId == null) {
        category = categories.filter(f => !f.parentId);

    } else {
        category = categories.filter(f => f.parentId == parentId);

    }

    for (let cat of category) {

        myCat.push({
            _id: cat._id,
            name: cat.name,
            slug: cat.slug,
            parentId: cat.parentId,
            children: creatNewCate(categories, cat._id),
        });
    }

    return myCat;
}

function createChils(categories, slug) {
    const category = categories.filter(f => f.slug == slug);

    let myIds = [];
    for (let cat of category) {

        if (cat.children.length > 0) {
            cat.children.map(ch => {
                console.log(ch);
                if (ch.children.length > 0) {
                    ch.children.map(ch1 => {
                        myIds.push(ch1._id.toString());
                        console.log(ch1);

                    })
                }
            })
        }
    }

    return myIds;

}
function createSubChils(categories, slug) {
    let myCat = [];
    categories.map(cat => {
        const child = cat.children;
        child.map(ch => {
            if (ch.slug === slug) {
                ch.children.map(sub => {
                    myCat.push(sub._id.toString());
                })
            }
        })

    });
    return myCat;

}