// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var eventuser = event.userInfo.openId;
  var eventid = event.id;
  var eventtype = event.type;
  var dbName = eventtype == '01' ? "poem_collect" : "poet_collect";
  var result = await db.collection(dbName).where({ id: eventid ,user:eventuser}).count();
  return {message:result.total>0}
}