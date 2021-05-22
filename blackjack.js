
// Grabbed ideas from:
// https://wsvincent.com/javascript-object-oriented-deck-cards/
// https://www.thatsoftwaredude.com/content/6417/how-to-code-blackjack-using-javascript
// https://hackernoon.com/blackjack-application-with-javascript-2c76db51dea7

const suits = ['Hearts', 'Spades', 'Clubs', 'Diamons'];
const suitsSymbol = ['&hearts;', '&spades;', '&clubs;', '&diams;'];
const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

class Player {
    constructor(name) {
        this._name = name;
        this.hand = [];
        this.points = 0;
        this.stay = false;
        this.isBusted = false;
    }

    get name() {
        return this._name;
    }

    showHand() {
        // Only used when run in a terminal
        return this.hand.map(card => {
            return card.isVisible ? card.string : '*';
        });
    }

    calculateHand() {
        const cards = this.hand;
        let isSoftHand = false;
        let total = 0;

        cards.forEach(card => {
            if (card.isVisible) {
                if (card.face === 'Ace') {
                    isSoftHand = true
                    if (isSoftHand && total < 11) {
                        total += 11;
                    } else if (isSoftHand) {
                        total += 1;
                    }
                } else {
                    total += card.value;
                };
            }
        });
        return total;
    }

    updateHandValue() {
        this.points = this.calculateHand();
        const $playerTitle = $('.' + this.name + '-points');
        $playerTitle.html('<h1>'+ this.points + '</h1>');
        return this.points;
    }

    addCard(card) {
        this.hand.push(card);
        return card;
    }

    reset() {
        this.isBusted = false;
        this.points = 0;
        this.hand = [];
        this.stay = false;
    }
}

class Card {
    constructor(face, suit) {
        this.face = face;
        this.suit = suit;
        this.symbol = suitsSymbol[suits.indexOf(this.suit)];
        this._string = `${this.face}${this.suit}`
        this._rank = face.toString();
        this.html = `<li>
                        <div class="card rank-${this.rank} ${this.suit.toLowerCase()}">
                        <span class="rank">${this.rank.toUpperCase()}</span>
                        <span class="suit">${this.symbol}</span>
                        </div>
                    </li>`;
        this.isVisible = true;
    }

    get value() {
        const namedCards = ['Jack', 'Queen', 'King'];
        if (namedCards.includes(this.face)) { return 10 };
        if (this.face === 'Ace') return 11;
        return parseInt(this.face);
    }
    get string() {
        return this._string;
    }

    get rank() {
        const names = ['Jack', 'Queen', 'King', 'Ace'];
        if (names.includes(this.face)){
            return this._rank[0].toLowerCase();
        }
        return this._rank;
    }

    toogleVisibility() {
        this.isVisible = !(this.isVisible);
    }

    hide() {
        this.isVisible = false;
    }

    show() {
        this.isVisible = true;
    }

    print() {
        console.log(this._string);
    }
}

class Deck {
    constructor () {
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
        deck.sort( () => Math.random() - 0.5);
        return this;
    }

    getDeck () {
        return this.deck;
    }

    print() {
        this.deck.forEach(card =>{
            console.log(card.string);
        })
    }
}

class Shoe {
    constructor (numberOfDecks) {
        this.shoe = [];
        for (let i=0; i < numberOfDecks; i++) {
            let tempDeck = new Deck();
            tempDeck.shuffle();
            tempDeck.getDeck().forEach(card => {
                this.shoe.push(card);
            })
        }
    }

    deal() {
        return this.shoe.pop();
    }

    cardsLeft() {
        return this.shoe.length;
    }

    print() {
        this.shoe.forEach(card => {
            console.log(card.string);
        });
    }
}

class Game {
    constructor (human, dealer, numberOfDecks) {
        this.human = human;
        this.dealer = dealer;
        this._numberOfDecks = numberOfDecks;
        this.shoe = new Shoe(numberOfDecks);
        this._currentPlayer = this.human;
    }

    get currentPlayer() {
        return this._currentPlayer;
    }

    set currentPlayer(newPlayer) {
        this._currentPlayer= newPlayer;
    }

    startGame () {
        this.resetUI();
        if (this.shoe.cardsLeft() < 10) {
            this.shoe = new Shoe(this._numberOfDecks);
        }
        this.hit(this.human);
        this.hit(this.dealer);
        this.hit(this.human);
        this.hit(this.dealer, false);
        this.firstTurnBJ();
    }

    firstTurnBJ() {
        // We check if the first cards dealt to the player are blackjack and end the round.
        if (human.points === 21) {
            this.declareWinner('Player');
        }
    }

    hit (player, visible=true) {
        const newCard = this.shoe.deal();
        if (!(visible)) newCard.isVisible = false;
        player.addCard(newCard);
        player.updateHandValue();
        this.drawCards(player);
        this.nextTurn();
    }


    stay (player) {
        this.currentPlayer.stay = true;
        this.changePlayer();
        if (this.currentPlayer.name === 'dealer') {
            this.playDealer();
        }
    }

    changePlayer () {
        $('#' + this.currentPlayer.name).toggleClass('active')
        const newPlayer = this.currentPlayer.name === 'dealer' ? human : dealer;
        this._currentPlayer = newPlayer;
        $('#' + this.currentPlayer.name).toggleClass('active')
    }

    drawCards (player) {
        const $cardContainer = $('.' + player.name + '-cards-container');
        const $cardsDiv = $cardContainer.children().closest('.cards').find('.table');
        const $cardsHtml = player.hand.map(card => {
            if (!(card.isVisible)) { return '<div class="card back">*</div>' };
            return card.html;
        });
        $cardsDiv.html($cardsHtml);
    }

    disableButtons() {
        $('#hit-btn').prop('disabled', true);
        $('#stay-btn').prop('disabled', true);
    }

    declareWinner(winner) {
        this.disableButtons();
        dealer.hand[1].show();
        dealer.updateHandValue();
        this.drawCards(this.dealer);
        $resultBox.html('<h1>' + winner + ' wins!</h1>')
    }

    nextTurn() {
        // this logic is all over the place, needs some rethinking
        if (this.currentPlayer.points > 21) {
            this.currentPlayer.isBusted = true;
            this.disableButtons();
            if(this.currentPlayer.name === 'human') $resultBox.html('<h1>Busted</h1>');
            if(this.currentPlayer.name === 'dealer') this.declareWinner('Player');
            return

        }
        if (this.currentPlayer === 21) {
            // player wins
            this.currentPlayer.stay = true;
            this.disableButtons();
            $resultBox.html('<h1>Blacjack!</h1>')
            return
        }

        if(this.human.stay && this.dealer.stay) {
            if(this.human.points === this.dealer.points) {
                $resultBox.html('<h1>Draw</h1>');
            } else {
                dealer.points > human.points ? this.declareWinner('Dealer') : this.declareWinner('Player');
            }
        }
        return
    }

    resetUI() {
        this.human.reset();
        this.dealer.reset();
        $('.dealer-box').show();
        $('.human-box').show();
        $('.results-box').show();
        $('#hit-btn').show();
        $('#stay-btn').show();
        $('#hit-btn').prop('disabled', false);
        $('#stay-btn').prop('disabled', false);
        $('#start-btn').html('Restart');
        $('#' + dealer.name).removeClass('active')
        $('#' + human.name).addClass('active')
        this.currentPlayer = this.human;
        $resultBox.html('');
    }

    playDealer() {
        // This is the dealer turn
        // The dealer always stays when it has more than 17 points or busts
        this.disableButtons();
        dealer.hand[1].show();
        dealer.updateHandValue();
        this.drawCards(this.dealer);
        while (dealer.points < 17) {
            this.hit(this.dealer);
        }
        dealer.stay = true;
        this.nextTurn();
    }
}

const human = new Player('human');
const dealer = new Player('dealer');
const decks = 2
const blackjack = new Game(human, dealer, decks);

$('.dealer-box').hide();
$('.human-box').hide();
$('#hit-btn').hide();
$('#stay-btn').hide();
$resultBox = $('.result-box');