var PieceRenderer = (function () {

    var pieces = {}   // uuid → entity

    function spawnOrMove(player) {

        var id = "" + player.uuid
        var data = BoardState.getPlayerData(player)
        if (!data) return

        var pos = BoardGrid.toWorldPos(data.x, data.z)

        // 已存在 → 移动
        if (pieces[id]) {
            pieces[id].teleportTo(
                pos.x + 0.5,
                pos.y,
                pos.z + 0.5
            )
            return
        }

        // 新建棋子
        var entity = player.server.overworld().createEntity("minecraft:armor_stand")

        entity.setPos(
            pos.x + 0.5,
            pos.y,
            pos.z + 0.5
        )

        entity.setNoGravity(true)
        entity.setInvisible(false)
        entity.setCustomName(player.name)
        entity.setCustomNameVisible(true)
        entity.setItemSlot("head", "minecraft:diamond_block")
        entity.spawn()

        pieces[id] = entity
    }

    function removeAll() {
        for (var id in pieces) {
            pieces[id].kill()
        }
        pieces = {}
    }

    return {
        spawnOrMove: spawnOrMove,
        removeAll: removeAll
    }

})()
