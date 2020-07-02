const testFolder = './imgs/PokerCard'
const fs = require('fs')
let Obj = {}
let json
fs.readdir(testFolder, (err, files) => {
    files.forEach(fullName => {
        if (fullName != ".DS_Store") {
            let fileName = fullName.split('.')[0]
            Obj[fileName] = fullName
        }
    })
    json = JSON.stringify(Obj)
    fs.writeFile('card.json', json, 'utf8', err => {
        if(err){
            console.log(err)
        }
    })
})
