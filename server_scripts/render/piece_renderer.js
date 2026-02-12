var PieceRenderer = (function () {

    var pieces = new Map()

    function spawnOrMove(player) {
        player.tell("§b生成棋子")

        var dim = player.level
        var data = BoardState.getPlayers().get(player.uuid)
        if (!data) return

        var pos = BoardGrid.toWorldPos(data.x, data.z)

        // 已存在 → 移动
        if (pieces.has(player.uuid)) {
            var existing = pieces.get(player.uuid)
            existing.teleportTo(pos.x + 0.5, pos.y, pos.z + 0.5)
            return
        }

        // 新建棋子
        var entity = dim.createEntity("minecraft:armor_stand")
        entity.setPosition(pos.x + 0.5, pos.y, pos.z + 0.5)
        entity.setNoGravity(true)
        entity.setInvisible(false)
        entity.setCustomName(player.name)
        entity.setCustomNameVisible(true)   // ← 这里
        entity.setGlowing(true)
        entity.spawn()

        pieces.set(player.uuid, entity)
    }

    function clearAll() {

        var iterator = pieces.values()

        while (iterator.hasNext()) {
            var e = iterator.next()
            e.kill()
        }

        pieces.clear()
    }

    return {
        spawnOrMove: spawnOrMove,
        clearAll: clearAll
    }

})()

