// 禁止丢弃棋盘物品

ItemEvents.dropped(function(event) {

    var player = event.player
    if (!PlayerRegistry.isRegistered(player)) return

    var id = event.item.id

    if (
        id === GAME_ITEMS.MOVE_ITEM ||
        id === GAME_ITEMS.OBSTACLE_ITEM ||
        id === GAME_ITEMS.SPRING_ITEM
    ) {
        event.cancel()
        player.tell("§c棋盘物品不可丢弃")
    }

})

