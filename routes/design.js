const express = require('express')
const Design = require('./../models/design')
const router = express.Router()

router.get('/', async (req, res) => {
    const designs = await Design.find().sort({lastModified:"desc"})
    res.render('designs', { designs: designs })
})

router.get('/new', async (req, res) => {
    var existingDesigns = await Design.find().count() + 1

    var design = new Design();
    design.title = "Design " + existingDesigns
    
    design = await design.save(); // inserts on creation

    res.redirect(`/designs/edit/${design.id}`)
})

router.get('/edit/:id', async (req, res) => {
    const design = await Design.findById(req.params.id)
    if (design == null) res.redirect('/')
    res.render("build", { design: design })
});

router.get('/data/:id', async (req, res) => {
    const design = await Design.findById(req.params.id)
    res.send(design ? design.data || {} : {})
})

router.put('/:id', async (req, res, next) => {
    req.design = await Design.findById(req.params.id)
    next()
}, saveDesign())

router.delete('/:id', async (req, res) => {
    await Design.findByIdAndDelete(req.params.id)
    res.redirect('/designs')
})

function saveDesign() {
    return async (req, res) => {
        let design = req.design;
        design.title = req.body.title;
        design.description = req.body.description;
        design.thumbnailurl = req.body.thumbnailurl;
        design.data = req.body.data;
        design.lastModified = Date.now();
        try {
            design = await design.save()
        } catch (e){
            console.log(e)
        }
    }
}

module.exports = router