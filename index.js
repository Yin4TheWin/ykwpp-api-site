require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
let checkAndPush=(rows, old)=>{
  let newChanges=[]
  //Look at info from previous scrape and remove from current
  // let oldNames=old.map(el=>{
  //   return el.name
  // })
  // oldNames.forEach(e=>{
  //   console.log(e)
  // })
  old.forEach(oldName=>{
    rows.forEach((el,i)=>{
      if(oldName.name===el.name){
        rows.splice(i, 1)
      }
    })
  })
  console.log("Loaded "+doc.title);
  rows.forEach(el=>{
    let yokaiObj={
      //name rank tribe hp attack soult skill g series
      name: el.name,
      rank: el.rank,
      tribe: el.tribe,
      hp: el.hp,
      attack: el.attack,
      soult: el.soult,
      skill: el.skill,
      g: el.g,
      series: el.series,
      image: el.img
    }
    newChanges.push(yokaiObj)
  })
  newChanges.forEach(el=>{
    console.log(el)
  })
}
(async()=>{
  await doc.useServiceAccountAuth(require('./credential.json'))
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]
  const old = await doc.sheetsByIndex[1].getRows();
  const rows = await sheet.getRows();
  checkAndPush(rows, old)
  setInterval(function(){checkAndPush(rows)}, 50000)
})()
