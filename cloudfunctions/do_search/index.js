// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database();
const _ = cloud.command;
// 云函数入口函数
exports.main = async (event, context) => {
  var value = event.value.trim();
  if (!value) {
    return { data: [], hasMore: false }
  }
  var data = [];
  await db.collection("poet").field({
    poetId: true,
    name: true,
    desc: true
  }).where({
    name: {
      $regex: '.*' + value,
      $options: 'i' //不区分大小写
    }
  }).get().then(res => {
    if (res.data) {
      for (var i = 0; i < res.data.length; i++) {
        data.push({
          id: res.data[i].poetId,
          type: "00",
          name: res.data[i].name,
          content: res.data[i].desc
        });
      }
    }
  });
  await db.collection("poetry").field({
    id:true,
    name:true,
    content:true
  }).where({
    name: {
      $regex: '.*' + value,
      $options: 'i' //不区分大小写
    } 
    }).orderBy('star', 'desc').get().then(res =>{
    if (res.data) {
      for (var i = 0; i < res.data.length; i++) {
        if (data.findIndex(result=>{ return result.id==res.data[i]._id })==-1) {
          data.push({
            id: res.data[i]._id,
            type: "01",
            name: res.data[i].name,
            content: res.data[i].content
          });
        }
      }
    }
  });
  await db.collection("poetry").field({
    id: true,
    name: true,
    content: true
  }).where({
    content: {
      $regex: '.*' + value,
      $options: 'i' //不区分大小写
    }
    }).orderBy('star', 'desc').get().then(res => {
    if (res.data) {
      for (var i = 0; i < res.data.length; i++) {
        if (data.findIndex(result => { return result.id == res.data[i]._id }) == -1) {
          data.push({
            id: res.data[i]._id,
            type: "01",
            name: res.data[i].name,
            content: res.data[i].content
          });
        }
      }
    }
  });
  return data;
}