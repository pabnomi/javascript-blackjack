
// Code inspired from https://wsvincent.com/javascript-object-oriented-deck-cards/

// const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
const suits = ['♥', '♠', '♣', '♦'];

const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

let players = {};

class Card {
    constructor(face, suit) {
        this.face = face;
        this.suite = suit;
        this._string = `${face}${suit}`
        this._rank = face.toString().toLowerCase();
        this.css = `card rank-${this._rank} ${suit}`;
        this.visible = true;
    }

    get value() {
        const namedCards = ['Jack', 'Queen', 'King'];
        if (namedCards.includes(this.face)) { return 10 };
        if (this.face === 'Ace') return 11;
        return this.face;
    }
    get string() {
        return this._string;
    }

    toogleVisibility() {
        this.visible = !(this.visible);
    }

    hide() {
        this.visible = false;
    }

    print() {
        console.log(this._string);
    }
}

class Deck {
    constructor() {
        this.deck = [];
        suits.forEach(suit => {
            values.forEach(value => {
                this.deck.push(new Card(value, suit));
            })
        });
    }
    shuffle() {
        const { deck } = this;
        deck.sort( () => Math.random() - 0.5);
        deck.sort( () => Math.random() - 0.5);
        return this;
    }
    deal() {
        return this.deck.pop();
    }
    cardsLeft() {
        return this.deck.length;
    }
    print() {
        console.log(this.deck.map(card => {
            return card.string;
        }));
    }
}

const calculateHand = (cards) => {
    if (Object.entries(cards).every(card => { return typeof card }) === 'object'){
        return false;
    };

    let isSoftHand = false;
    let total = 0;
    cards.forEach(card => {
        if (card.face === 'Ace') {
            isSoftHand = true
        } else {
            total += card.value;
        };
    });
    if (isSoftHand && total < 11) {
        total += 11;
    } else if (isSoftHand) {
        total += 1;
    }
    return total;
};

const startGame = () => {
    const deck = new Deck();
    deck.shuffle();

    // for(let player in players) {

    // }
    const aceHearts = new Card('Ace', suits[0]);
    players['player'] = [deck.deal(), deck.deal()];
    players['computer'] = [deck.deal(), deck.deal()];
    players['computer'][1].toogleVisibility();

    console.log(players['player'].map(card => card.string));
    console.log(calculateHand(players['player']));
    players['player'].push(aceHearts);
    console.log(players['player'].map(card => card.string));
    console.log(calculateHand(players['player']));
}


startGame();
// gameDeck.print();

// const myCard = gameDeck.deal();
// myCard.print();
// console.log(gameDeck.cardsLeft())


