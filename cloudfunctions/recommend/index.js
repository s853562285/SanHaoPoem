// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  var eventuser = event.userInfo.openId;
  const seedPoet=1;
  const seedPoem=2;
  const seedStar=3;
  const seedMostStar=4;
  const seedAllRandom=5;
  var recommendID = '';
  var seeds=[1,4,4,1,5,1,4,1,4,2,3,4,5,4,1,4,3,4,2,4,3,4,4,4];
  var seed = parseInt((seeds.length-1) * Math.random());//产生随机数，决定从哪里选择推荐
  if(seeds[seed]==seedPoet){
    return await db.collection('poet_collect').where({ user: eventuser }).orderBy('date', 'desc').get()
    .then(res =>{
      if (res.errMsg.indexOf('ok') != -1 && res.data.length>0) {
        // collectPoets.concat(res.data);
        var poetIndex = parseInt((res.data.length - 1) * Math.random());//从收藏作者中随机抽取一位
        var poet = res.data[poetIndex];
        return db.collection('poetry').field({
          _id: true,
          id: true
        }).where({
          'poet.name': poet.name
        }).get();
      }else{
        return {errMsg:'false'}
      }
    }).then(res => {
      if (res.errMsg.indexOf('ok') != -1 && res.data.length > 0) {
        // poetPoems.concat(res.data);
        recommendID = res.data[parseInt((res.data.length - 1) * Math.random())]._id;//从该作者诗文中随机抽取一篇推荐
        return db.collection('poetry').where({
          _id: recommendID
        }).get();
      } else {
        return db.collection('poetry').orderBy('star', 'desc').skip(parseInt(1000 * Math.random())).limit(1).get();
      }

    });
  } else if (seeds[seed] == seedPoem){

    return await db.collection('poem_collect').where({ user: eventuser }).orderBy('date', 'desc').get()
      .then(res => {
        if (res.errMsg.indexOf('ok') != -1 && res.data.length > 0) {
          // poetPoems.concat(res.data);
          recommendID = res.data[parseInt((res.data.length - 1) * Math.random())].id;//从该收藏诗文中随机抽取一篇推荐
          return db.collection('poetry').where({
            _id: recommendID
          }).get();
        } else {
          return db.collection('poetry').orderBy('star', 'desc').skip(parseInt(1000 * Math.random())).limit(1).get();
        }

      });
  } else if (seeds[seed] == seedStar) {

    return await db.collection('poem_star').where({ user: eventuser }).orderBy('date', 'desc').get()
    .then(res => {
      if (res.errMsg.indexOf('ok') != -1 && res.data.length > 0) {
        // poetPoems.concat(res.data);
        recommendID = res.data[parseInt((res.data.length - 1) * Math.random())].id;//从该点赞诗文中随机抽取一篇推荐
        return db.collection('poetry').where({
          _id: recommendID
        }).get();
      }else{
        return db.collection('poetry').orderBy('star', 'desc').skip(parseInt(1000 * Math.random())).limit(1).get();
      }

    });
  } else if (seeds[seed] == seedMostStar) {//点赞最多的1000条里读取一条
    return db.collection('poetry').orderBy('star', 'desc').skip(parseInt(1000 * Math.random())).limit(1).get();

  } else {
    var recommendIndex = parseInt(72417 * Math.random());//诗库里随机读取一首
    // console.info(recommendIndex)
    return await db.collection('poetry').where({
      id: recommendIndex
    }).get();

  }

}