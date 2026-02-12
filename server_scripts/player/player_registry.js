var PlayerRegistry = (function () {

    function register(player) {

        if (!BoardState.isGameStarted()) return

        var order = BoardState.getPlayerOrder()

        if (order.indexOf(player.uuid) !== -1) return

        if (order.length >= BOARD_CONFIG.MAX_PLAYERS) {
            player.tell("§c玩家已满")
            return
        }
        BoardState.addPlayer(player)
        TurnManager.addPlayer(player)
        PieceRenderer.spawnOrMove(player)
        player.tell("§a已加入棋局")
    }

    function isRegistered(player) {
        return BoardState.getPlayerOrder().indexOf(player.uuid) !== -1
    }

    return {
        register: register,
        isRegistered: isRegistered
    }

})()

