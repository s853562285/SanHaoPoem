// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  var eventuser = event.userInfo.openId;
  var eventtype = event.type;
  var dbName = eventtype == '01' ? "poem_collect" : "poet_collect";

  var pageIndex = event.pageIndex ? event.pageIndex : 1;
  var pageSize = event.pageSize ? event.pageSize : 10;
  var filter = {user: eventuser};
  const countResult = await db.collection(dbName).where(filter).count();
  const total = countResult.total;
  const totalPage = Math.ceil(total / pageSize);
  if (pageIndex > totalPage || pageIndex == totalPage) {
    hasMore = false;
  } else {
    hasMore = true;
  }

  return db.collection(dbName).where(filter).orderBy('date', 'desc')
    .skip((pageIndex - 1) * pageSize).limit(pageSize).get().then(res => {
    res.hasMore=hasMore;
    return res;
  });
}