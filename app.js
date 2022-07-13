const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const methodOverride = require('method-override')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const Photo = require('./models/Photo')

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

//TEMPLATE ENGINE
app.set('view engine', 'ejs')

// MIDDLEWARES
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(fileUpload())
app.use(methodOverride('_method', {
  methods:['POST', 'GET']
}))

//ROUTES
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated')
  console.log(photos)
  res.render('index', {
    photos
  }) // views/index.ejs
})
app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/add', (req, res) => {
  res.render('add')
})

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  res.render('photo', {
    photo
  })
})

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads'

  if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
  }

  let uploadImage = req.files.image
  let uploadPath  = __dirname + '/public/uploads/' + uploadImage.name

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name
    })
    res.redirect('/')
  })
})

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({_id: req.params.id})
  res.render('edit', {
    photo
  })
})

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id })
  photo.title = req.body.title
  photo.description = req.body.description
  await photo.save()

  res.redirect(`/photos/${req.params.id}`)
})

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({_id: req.params.id})  
  let deletedImage = __dirname + '/public' + photo.image // /uploads/image_name.img
  fs.unlinkSync(deletedImage)
  await Photo.findByIdAndRemove(req.params.id)
  res.redirect('/')
})

const port = 3000
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`)
})
