var MovementLogic = (function () {

    function handleMove(player) {

        if (!PlayerRegistry.isRegistered(player)) {
            player.tell("§c你未加入游戏")
            return
        }

        PlayerActions.move(player)
    }

    return {
        handleMove: handleMove
    }

})()
