const nickname = prompt('請輸入你的暱稱');
let chips = 3000
let deck = []
let deck_obj = {}
let dealer_hand = [], dealer_score = 0, dealer_score2 = 0
let player_hand = [], player_score = 0, player_score2 = 0
let pot = 0
let d_f = 0, p_f = 0

const dealer_card = document.getElementById('dealer_card')
const player_card = document.getElementById('player_card')
const pot_money = document.getElementById('pot_money')
const betsize = document.getElementById('betsize')

const playerID = document.getElementById('player_info')
const playerStr = '『' + nickname + '』' + '<img class="icon" src="imgs/money_icon.png">'


let load = async () => {
    if (nickname) {
        playerID.innerHTML = playerStr + chips.toString()

        await $.get('card.json', data => {
            deck_obj = data
            for (const [key, value] of Object.entries(data)) {
                deck.push(key)
            }
        })
        shuffle(deck)
    }
}
window.onload = load 



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function fnStart() {
    pot = parseInt(betsize.value)
    if (pot <= chips) {
        pot_money.innerHTML = pot.toString()
        betsize.value = ""
        chips -= pot
        playerID.innerHTML = playerStr + chips.toString()

        for (let i = 0; i < 2; i++) {
            dealer_hand.push(deck.pop())
            player_hand.push(deck.pop())
            player_card.innerHTML += '<img src="imgs/PokerCard/' + deck_obj[player_hand[player_hand.length - 1]] + '">'
        }
        dealer_card.innerHTML = '<img src="imgs/green_back.png">'
        dealer_card.innerHTML += '<img src="imgs/PokerCard/' + deck_obj[dealer_hand[dealer_hand.length - 1]] + '">'

        fnCountDealer(d_f, 0)
        fnCountPlayer(p_f, 0)
        fnVersus(false)

    }
    else {
        alert("請重新選擇下注金額")
        betsize.value = ""
    }
}



function fnAddcard() {
    dealer_hand.push(deck.pop())
    player_hand.push(deck.pop())
    dealer_card.innerHTML += '<img src="imgs/PokerCard/' + deck_obj[dealer_hand[dealer_hand.length - 1]] + '">'
    player_card.innerHTML += '<img src="imgs/PokerCard/' + deck_obj[player_hand[player_hand.length - 1]] + '">'
    fnCountDealer(d_f, dealer_hand.length - 1)
    fnCountPlayer(p_f, player_hand.length - 1)
    fnVersus(false)
}

function fnFold() {
    while (Math.max(dealer_score, dealer_score2) < 17
        || (Math.max(dealer_score, dealer_score2) > 21
            && Math.min(dealer_score, dealer_score2) < 17)) {

        dealer_hand.push(deck.pop())
        dealer_card.innerHTML += '<img src="imgs/PokerCard/' + deck_obj[dealer_hand[dealer_hand.length - 1]] + '">'
        fnCountDealer(d_f, dealer_hand.length - 1)
    }
    fnVersus(true)
}

function fnNext() {
    dealer_card.innerHTML = ""
    player_card.innerHTML = ""
    pot = 0
    pot_money.innerHTML = ""

    dealer_hand.length = 0
    dealer_score = 0
    dealer_score2 = 0
    player_hand.length = 0
    player_score = 0
    player_score2 = 0
    d_f = 0, p_f = 0
}


function fnEnd() {
    alert("最終結果：" + chips + " 個籌碼")
    fnNext()
    load()
}


function fnVersus(isFold) {
    let d, p
    if (Math.max(dealer_score, dealer_score2) <= 21) {
        d = Math.max(dealer_score, dealer_score2)
    }
    else {
        d = Math.min(dealer_score, dealer_score2)
    }
    if (Math.max(player_score, player_score2) <= 21) {
        p = Math.max(player_score, player_score2)
    }
    else {
        p = Math.min(player_score, player_score2)
    }

    if (p == 21) { fnWin(d, p) }
    else if (d == 21) { fnLose(d, p) }
    else if (p > 21) { fnLose(d, p) }
    else if (d > 21) { fnWin(d, p) }
    else if (isFold) {
        if (p > d) { fnWin(d, p) }
        else if (p < d) { fnLose(d, p) }
        else {
            chips += pot
            playerID.innerHTML = playerStr + chips.toString()

            dealer_card.innerHTML = ""
            for (let i = 0; i < dealer_hand.length; i++) {
                dealer_card.innerHTML += '<img src="imgs/PokerCard/'
                    + deck_obj[dealer_hand[i]] + '">'
            }
            alert("和局")
        }
    }
}

function fnWin(d, p) {
    chips += pot * 2
    playerID.innerHTML = playerStr + chips.toString()

    dealer_card.innerHTML = ""
    for (let i = 0; i < dealer_hand.length; i++) {
        dealer_card.innerHTML += '<img src="imgs/PokerCard/'
            + deck_obj[dealer_hand[i]] + '">'
    }
    alert("『 贏 』" + pot.toString() + "個籌碼\n"
        + "Dealer：" + d + "\n"
        + "Player：" + p)
}

function fnLose(d, p) {
    dealer_card.innerHTML = ""
    for (let i = 0; i < dealer_hand.length; i++) {
        dealer_card.innerHTML += '<img src="imgs/PokerCard/'
            + deck_obj[dealer_hand[i]] + '">'
    }
    alert("『 輸 』" + pot.toString() + "個籌碼\n"
        + "Dealer：" + d + "\n"
        + "Player：" + p)
}

function fnCountDealer(temp_d_f, i) {
    let d_score = Math.min(parseInt(dealer_hand[i].slice(0, dealer_hand[i].length - 1)), 10)
    let d_score2 = 0

    if (d_score == 1 && temp_d_f == 0) {
        d_score2 = d_score + 10
        temp_d_f += 1
        d_f += 1
    }
    else {
        d_score2 = d_score
    }
    dealer_score += d_score
    dealer_score2 += d_score2

    if (dealer_hand.length - 1 > i) {
        fnCountDealer(temp_d_f, i + 1)
    }
}

function fnCountPlayer(temp_p_f, i) {
    let p_score = Math.min(parseInt(player_hand[i].slice(0, player_hand[i].length - 1)), 10)
    let p_score2 = 0

    if (p_score == 1 && temp_p_f == 0) {
        p_score2 = p_score + 10
        temp_p_f += 1
        p_f += 1
    }
    else {
        p_score2 = p_score
    }

    player_score += p_score
    player_score2 += p_score2

    if (player_hand.length - 1 > i) {
        fnCountPlayer(temp_p_f, i + 1)
    }
}

/* function fnCountscore(temp_d_f, temp_p_f, i) {

    let d_score = Math.min(parseInt(dealer_hand[i].slice(0, dealer_hand[i].length - 1)), 10)
    let p_score = Math.min(parseInt(player_hand[i].slice(0, player_hand[i].length - 1)), 10)

    let d_score2 = 0
    let p_score2 = 0

    if (d_score == 1 && temp_d_f == 0) {
        d_score2 = d_score + 10
        temp_d_f += 1
        d_f += 1
    }
    else {
        d_score2 = d_score
    }

    if (p_score == 1 && temp_p_f == 0) {
        p_score2 = p_score + 10
        temp_p_f += 1
        p_f += 1
    }
    else {
        p_score2 = p_score
    }

    dealer_score += d_score
    dealer_score2 += d_score2
    player_score += p_score
    player_score2 += p_score2


    console.log(dealer_score)
    console.log(dealer_score2)
    console.log(player_score)
    console.log(player_score2)

    if (dealer_hand.length - 1 > i) {
        fnCountscore(temp_d_f, temp_p_f, i + 1)
    }
} */