// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const testDB = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  //超过100条需要重写该函数
  return await testDB.collection('tag').get({
    success: function (res) {
      // console.info(res)
      return res
    },
    fail: function (info) {
      return info
    }
  })
}