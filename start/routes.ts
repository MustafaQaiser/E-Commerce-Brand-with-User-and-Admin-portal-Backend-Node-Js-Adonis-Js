/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.get('/', async ({ view }) => {
//   return {hello:'world'}
// })

Route.post('/register', 'LoginController.register')
Route.post('/login', 'LoginController.login')
Route.get('/getAllUsers', 'LoginController.getAllUsers')
Route.delete('/deleteUser', 'LoginController.deleteUser')
Route.put('/updateUser/:id', 'LoginController.updateUser')
Route.get('/viewUserDetails/:id', 'LoginController.viewUserDetails')
Route.post('/storeUserProfile/:id', 'LoginController.storeUserProfile')
Route.get('getUserProfiles/:id', 'LoginController.getUserProfiles');
Route.post('/downloadFile1', 'LoginController.downloadFile1')


Route.post('/storeOrderDetail/:id', 'OrdersController.storeOrderDetail')
Route.get('getOrderDetailsByUserId/:id', 'OrdersController.getOrderDetailsByUserId');
Route.get('search/:id', 'OrdersController.search');
Route.get('sortrecords/:id', 'OrdersController.sortrecords');
Route.post('/getorderfile/:id', 'OrdersController.getorderfile')
Route.post('/downloadFiles', 'OrdersController.downloadFiles')
Route.post('/orderitems', 'OrdersController.orderitems')
Route.post('/itemdetails/:id', 'OrdersController.itemdetails')
Route.get('/getitemdetailsbyid/:id', 'OrdersController.getitemdetailsbyid')
Route.get('/getorderitems', 'OrdersController.getorderitems')


Route.post('/importcsv', 'CsvController.importcsv')
Route.post('/exportStocks', 'CsvController.exportStocks')
Route.post('/getuserresults', 'CsvController.getuserresults')
Route.post('/downloadFile', 'CsvController.downloadFile')
Route.post('/importProductCsv/:id', 'CsvController.importProductCsv')
Route.post('/exportProduct', 'CsvController.exportProduct')
Route.put('/updateProduct/:id', 'CsvController.updateProduct')
// Route.post('/downloadproductXlxs', 'CsvController.downloadproductXlxs')
Route.get('/viewProducts/:id','CsvController.viewProducts')



Route.post('/redis', 'RedisController.redis')
Route.post('/redissingle', 'RedisController.redissingle')
Route.post('/redisLength','RedisController.redisLength')
Route.get('/job','RedisController.job')


Route.post('/InsertCourierDetails', 'CourierRulesController.InsertCourierDetails')
Route.get('/getcourierdetails','CourierRulesController.getcourierdetails')
Route.put('/update/:id','CourierRulesController.update')

