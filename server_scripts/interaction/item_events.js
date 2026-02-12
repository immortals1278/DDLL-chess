ItemEvents.rightClicked(function (event) {

    var player = event.player
    var item = event.item

    if (!player || player.level.isClientSide()) return

    if (item.id === GAME_ITEMS.MOVE_ITEM) {
        event.cancel()
        MovementLogic.handleMove(player)
        return
    }

    if (item.id === GAME_ITEMS.OBSTACLE_ITEM) {
        event.cancel()
        PlacementLogic.handleObstacle(player)
        return
    }

    if (item.id === GAME_ITEMS.SPRING_ITEM) {
        event.cancel()
        PlacementLogic.handleSpring(player)
        return
    }

})


