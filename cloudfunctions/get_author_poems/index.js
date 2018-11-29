// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var author = event.author;
  if(!author){
    return {data:[],hasMore:false}
  }
  var hasMore;
  var dbName = 'poetry';
  var field = {
    id: true,
    name: true,
    content:true
  };
  var pageIndex = event.pageIndex ? event.pageIndex : 1;
  var pageSize = event.pageSize ? event.pageSize : 10;
  var filter = {
    'poet.id':parseInt(author)
  };
  const countResult = await db.collection(dbName).field(field).where(filter).count();
  const total = countResult.total;
  const totalPage = Math.ceil(total / pageSize);
  if (pageIndex > totalPage || pageIndex == totalPage) {
    hasMore = false;
  } else {
    hasMore = true;
  }
  return db.collection(dbName).field(field).where(filter).skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
    res.hasMore = hasMore;
    return res;
  });
}