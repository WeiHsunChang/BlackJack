let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
let obj = {'0':0, '1':0, '2':0, '3':0, '4':0, '5':0, '6':0, '7':0, '8':0, '9':0}
for(let i = 0; i<100000000; i++){
    obj[shuffle(arr)[0]] += 1
}
console.log(obj)

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}


