var GameController = (function () {

    function startGame(server) {

        if (BoardState.isGameStarted()) return

        BoardState.initBoard()
        BoardRenderer.drawBoard(server)
        server.tell("§a棋盘游戏已初始化，等待玩家加入...")
    }

    function playerJoin(player) {

        if (!BoardState.isGameStarted()) {
            player.tell("§c游戏尚未开始")
            return
        }

        PlayerRegistry.register(player)
        giveItems(player)

        if (BoardState.getPlayerOrder().length === BOARD_CONFIG.MAX_PLAYERS) {
            player.server.tell("§6玩家已满，游戏开始！")
            startFirstTurn(player.server)
        }
    }

    function giveItems(player) {
        player.inventory.clear()
        player.give(GAME_ITEMS.MOVE_ITEM)
        player.give(GAME_ITEMS.OBSTACLE_ITEM)
        player.give(GAME_ITEMS.SPRING_ITEM)
    }

    function startFirstTurn(server) {
        var id = TurnManager.currentPlayer()
        server.tell("§b轮到玩家 §f" + id)
    }

    return {
        startGame: startGame,
        playerJoin: playerJoin
    }

})()

