var mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost:27017/OWM-db'

/**
 * 连接
 */
mongoose.connect(DB_URL, {useNewUrlParser: true}, (err) => {
  if(err){
    console.log('Connection Error:' + err)
  }else{
    console.log('Connection success!') }
})

/**
  * 连接成功
  */
mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + DB_URL)
});    

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err)
});    
 
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected')
});

module.exports = mongoose
// var mongo=require("mongodb");
// var MongoClient = mongo.MongoClient;
// var assert = require('assert');
// var url = require('url');
// var host="localhost";
// var port="27017";
// var Urls = 'mongodb://localhost:27017/OWM-db';
 
// //add
// var add = function(db,collections,selector,fn){
//   var collection = db.collection(collections);
//   collection.insertMany([selector],function(err,result){
//     try{
//         assert.equal(err,null)
//         }catch(e){
//       console.log(e);
//       result = [];
//     };
    
//     fn(result);
//     db.close();
//   });
// }

// //delete
// var deletes = function(db,collections,selector,fn){
//   var collection = db.collection(collections);
//   collection.deleteOne(selector,function(err,result){
//     try{
//         assert.equal(err,null);
//         assert.notStrictEqual(0,result.result.n);
//         }catch(e){
//       console.log(e);
//       result.result = "";
//     };
    
//     fn( result.result ? [result.result] : []); //如果没报错且返回数据不是0，那么表示操作成功。
//     db.close;
//   });
// };

// //find
// var find = function(db,collections,selector,fn){
//   //collections="hashtable";
//   var collection = db.collection(collections);
  
//     collection.find(selector).toArray(function(err,result){
//       //console.log(docs);
//       try{
//         assert.equal(err,null);
//       }catch(e){
//         console.log(e);
//         result = [];
//       }
      
//       fn(result);
//       db.close();
//     });
 
// }
 
// //update
// var updates = function(db,collections,selector,fn){
//   var collection = db.collection(collections);
  
//   collection.updateOne(selector[0],selector[1],function(err,result){
//       try{
//         assert.equal(err,null);
//         assert.notStrictEqual(0,result.result.n);
//         }catch(e){
//       console.log(e);
//       result.result = "";
//     };
    
//     fn( result.result ? [result.result] : []); //如果没报错且返回数据不是0，那么表示操作成功。
//     db.close();
//   });
 
// }

// var methodType = {
//     // 项目所需
//   login:find,
//   //   type ---> 不放在服务器上面
//   //  放入到服务器
//   //  请求---> 根据传入进来的请求 数据库操作
//   //  req.query    req.body
//   show:find, //后台部分
//   add:add,
//   update:updates,
//   delete:deletes,
//   updatePwd:updates,
//   //portal部分
//   showCourse:find,
//   register:add
// };

// //主逻辑    服务器  ， 请求    --》 
// // req.route.path ==》 防止前端的请求 直接操作你的数据库
// module.exports = function(req, res ,collections, selector, fn){
//   MongoClient.connect(Urls, {useNewUrlParser: true}, function(err, db) {
//     assert.equal(null, err);
//     console.log("Connected correctly to server");
//     // // 根据 请求的地址来确定是什么操作  （为了安全，避免前端直接通过请求url操作数据库）
//     // methodType[req.route.path.substr(1)](db,collections,selector,fn);
    
//     db.close();
//   });
 
// };