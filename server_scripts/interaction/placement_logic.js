var PlacementLogic = (function () {

    function handleObstacle(player) {

        if (!PlayerRegistry.isRegistered(player)) {
            player.tell("§c你未加入游戏")
            return
        }

        PlayerActions.placeObstacle(player)
    }

    function handleSpring(player) {

        if (!PlayerRegistry.isRegistered(player)) {
            player.tell("§c你未加入游戏")
            return
        }

        PlayerActions.placeSpring(player)
    }

    return {
        handleObstacle: handleObstacle,
        handleSpring: handleSpring
    }

})()

