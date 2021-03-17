var MemoryGame = function(gs){
    var gs = gs;
    var cardList = [];
    var status = "Memory Game";
    var msg;
    var points = 0; 
    var selectedCard = -1;
    var bloqClick = false;
    

    this.initGame = function(){
        for(card in gs.maps){
            if(card != "back"){
                cardList.push(new MemoryGameCard(card));
                cardList.push(new MemoryGameCard(card));
            }
        }
        
        //Fisher-Yates Algorithm
        let i, j, cardAux;
        for(i = cardList.length - 1; i > 0; i--){
            j = Math.floor(Math.random() * (i + 1));
            cardAux = cardList[i];
            cardList[i] = cardList[j];
            cardList[j] = cardAux;
        }

        this.loop();
    }

    this.draw = function(){
        msg = status;
        gs.drawMessage(msg);
        let pos = 0;
        for(card in cardList){
            //card.draw(gs, pos);
            cardList[card].draw(gs, pos);
            pos++;
        }
    }

    this.loop = function(){
        setInterval(() =>{this.draw();}, 16);
    }

    this.onClick = function(cardId){

        /*Si las cartas se estan volteando 
        o se selecciona la misma carta, 
        o se selecciona una carta de una pareja encontrada, 
        hacer click no tiene efecto*/
        if(bloqClick || cardId == selectedCard || cardList[cardId].cardStatus == "found"){
            return null;
        }
        /*
        Comprueba si ha hecho click en una carta o fuera del tablero, en caso correcto
        la voltea
        */
        if(cardId < 0 || cardId > 15 || cardId == null){
            console.log("Pick a card");
        }
        else{
            cardList[cardId].flip();
        }

        //Selecciona la primera carta si no hay ninguna seleccionada
        if(selectedCard == -1){
            selectedCard = cardId;
        }
         /*
        Si ya se ha seleccionado una carta voltea otra carta para comprobar si es
        igual a la seleccionada
        */
        else{
            bloqClick = true;
            if(cardList[selectedCard].compareTo(cardList[cardId])){
                cardList[selectedCard].found();
                cardList[cardId].found();
                points++;
                bloqClick = false;
                status = "Pair found!"
            }
            else{
                setTimeout((card) => {
                    cardList[card].flip();
                    cardList[cardId].flip();
                    status = "Wrong pair!"
                    bloqClick = false;
                }, 750, selectedCard);
            }
            //Al finalizar la comparación libera la carta seleccionada
            selectedCard = -1;
        }

        if(points == cardList.length/2){
            status = "You win!"
            bloqClick = true;
        }
    }

}

var MemoryGameCard = function(sprite){
    this.sprite = sprite;
    this.cardStatus = "down";

    this.flip = function(){
        if(this.cardStatus == "down"){
            this.cardStatus = "up";
        }
        else if(this.cardStatus == "up"){
            this.cardStatus = "down";
        }
    }

    this.found = function(){
        this.cardStatus = "found";
    }

    this.compareTo = function(otherCard){
        return (this.sprite == otherCard.sprite);
    }

    this.draw = function(gs, pos){
        if(this.cardStatus == "down"){
            gs.draw("back", pos);
        }
        else{
            gs.draw(this.sprite ,pos);
        }
    }
}
