// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var eventuser = event.userInfo.openId;
  var eventid = event.id;
  var eventname = event.name;
  await db.collection('poetry').where({_id:eventid}).update({
    data: {
      // 表示指示数据库将字段自增 10
      star: _.inc(1)
    }
  });
  return db.collection('poem_star').add({
    data:{
      id:eventid,
      name:eventname,
      user:eventuser,
      date: db.serverDate()
    }
  }).then(res => {
    return res;
  });
}