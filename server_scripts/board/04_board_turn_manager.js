var TurnManager = (function () {

    function addPlayer(player) {

        var order = BoardState.getPlayerOrder()
        if (order.length >= BOARD_CONFIG.MAX_PLAYERS) return

        order.push(player.uuid)

        BoardState.getPlayers().set(player.uuid, {
            x: 2,
            z: BOARD_CONFIG.START_ROW,
            reachedGoal: false
        })
    }

    function currentPlayer() {
        var order = BoardState.getPlayerOrder()
        return order[BoardState.getTurnIndex()]
    }

    function nextTurn() {
        var index = BoardState.getTurnIndex() + 1
        var order = BoardState.getPlayerOrder()

        if (index >= order.length) index = 0
        BoardState.setTurnIndex(index)
    }

    function isPlayersTurn(player) {
        return player.uuid === currentPlayer()
    }

    return {
        addPlayer: addPlayer,
        currentPlayer: currentPlayer,
        nextTurn: nextTurn,
        isPlayersTurn: isPlayersTurn
    }

})()
