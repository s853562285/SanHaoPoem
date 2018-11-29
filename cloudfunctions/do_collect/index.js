// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var eventuser = event.userInfo.openId;
  var eventtype=event.type;
  var eventname=event.name;
  var eventid = event.id;
  var eventcontent = event.content;
  var dbName = eventtype=='01'?"poem_collect":"poet_collect";
  const isCollect = await db.collection(dbName).where({id:eventid,user:eventuser}).count();
  if (isCollect.total>0){//已收藏则取消收藏
    return await db.collection(dbName).where({ id: eventid }).remove();
  }else{
    return await db.collection(dbName).add({
      data: {
        id: eventid,
        user: eventuser,
        name: eventname,
        content: eventcontent,
        date: db.serverDate()
      }
    }).then(res =>{
      if (eventtype != '01'){//作者收藏时更新star字段
        return db.collection('poet').doc(eventid).update({data:{star:_.inc(1)}})
      }else{
        return db.collection('poetry').doc(eventid).update({ data: { collect: _.inc(1) } })
      }
    });
  }
}