const siege = require('siege')

const concurrent = 500
console.log(`并发量：${concurrent}`)
siege()
  .on(3000)
  .concurrent(concurrent) // 并发量
  .for(10000).times
  .get('http://localhost:3000/activity/getAll')
  .attack()