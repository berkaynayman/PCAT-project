const express = require('express')

const app = express()

app.get('/', (req, res) => {
  const photo = {
    id: 1,
    name: 'Photo name',
    desc: 'Photo desc'
  }
  res.send(photo)
  //res.send('HELLO')
})

const port = 3000
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`)
})
