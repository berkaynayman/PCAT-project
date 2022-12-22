const mongoose = require('mongoose')
const Schema = mongoose.Schema

//connect DB
//bu adreste database yok ise oluşturur
mongoose.connect('mongodb://127.0.0.1:27017/pcat-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
})

const Photo = mongoose.model('Photo', PhotoSchema)

//create a photo

Photo.create({
  title: 'Photo Title 2',
  decription: 'Photo description 2',
})

//read a photo
Photo.find({}, (err, data) => {
  console.log(data)
})

//update a photo
const id = "62c9631ed27e8752a3792b67"

Photo.findByIdAndUpdate(
    id,
    {
        title: 'Photo Title 111 Update',
        description: 'Photo desc 111 update'
    },
    {
        // consolde update olan verinin yeni halini görmek isterisek ekleriz
        new: true
    },
    (err, data) => {
        console.log(data)
    }
)

//delete a photo

Photo.findByIdAndDelete(id, (err, data) => {
  console.log('Photo is removed...')
})

Photo.deleteOne({title: 'Photo Title 2'})