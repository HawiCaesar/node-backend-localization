
import http from 'http'
import app from './app'
//import { i18next, i18nextMiddleware } from './i18n.js'

const server = http.createServer(app);
// app.use(
//     i18nextMiddleware.handle(i18next, {
//         ignoreRoutes: ['/foo'] // or function(req, res, options, i18next) { /* return true to ignore */ }
//     })
// )

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// // in your request handler
// app.get('/', (req, res) => {
//     //   var lng = req.language // 'de-CH'
//     //   var lngs = req.languages // ['de-CH', 'de', 'en']
//        //req.i18n.changeLanguage('en') // will not load that!!! assert it was preloaded
    
//       var exists = req.i18n.exists('welcome')
//       var translation = req.t('welcome')
//     console.log(translation, '%%%', exists)
//     res.send(req.t('welcome'))
// })

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});