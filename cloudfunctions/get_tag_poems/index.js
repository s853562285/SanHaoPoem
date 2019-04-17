// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var dbName=event.dbName;
  var tag=event.tag?event.tag:null;
  var field=event.field?event.field:null;
  var pageIndex = event.pageIndex ? event.pageIndex : 1;
  var pageSize = event.pageSize ? event.pageSize : 10;
  var filter = {
    tags: _.in([tag])
  };
  const countResult = await db.collection(dbName).field(field).where(filter).count();
  const total=countResult.total;
  const totalPage=Math.ceil(total/pageSize);
  var hasMore;
  if(pageIndex>totalPage||pageIndex==totalPage){
    hasMore=false;
  }else{
    hasMore=true;
  }
  return db.collection(dbName).field(field).where(filter).skip((pageIndex - 1) * pageSize).limit(pageSize).orderBy('star', 'desc').get().then(res =>{
    res.hasMore=hasMore;
    return res;
  });
}