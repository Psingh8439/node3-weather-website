const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geoCode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPAth = path.join(__dirname,'../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPAth)

// Setup static directory to server
app.use(express.static(publicDirectoryPath))

app.get('', (req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Parvinder Singh'
    })
})

app.get('/about', (req,res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Parvinder Singh'
    })
})

app.get('/help', (req,res)=>{
    res.render('help', {
        message: 'This is a message for help page',
        title: 'Help',
        name: 'Parvinder Singh'
    })
})

app.get('/weather', (req,res)=>{
    if(!req.query.address){
         return res.send({
            error: 'You must provide a address'
        })
    }

    geoCode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error){
            return res.send({error})
        }

        forecast(latitude,longitude,(error, forecastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })

    })
  
})

app.get('/products', (req,res)=>{

    if(!req.query.search){
         return res.send({
            error: 'You must provide a search term'
        })

    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req,res)=>{
    res.render('404',{
        title: 404,
        name: 'Parvinder Singh',
        errorMessage: 'Help article not found.'

    })

})

app.get('*',(req,res)=>{

    res.render('404', {
        title: 404,
        name: 'Parvinder Singh',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000, ()=>{
    console.log('Server is up on Port 3000.')
})