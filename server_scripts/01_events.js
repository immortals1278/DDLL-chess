// 玩家进入
PlayerEvents.loggedIn(event => {

    const player = event.player

    if (!Game.players.includes(player.uuid)) {
        Game.players.push(player.uuid)
    }

    if (!Game.started) {
    player.server.scheduleInTicks(1, () => {
        startGame(player.level, player)
    })
}

})



// 指南针进入移动模式
ItemEvents.rightClicked(event => {

    const player = event.player
    if (!Game.started) return

    if (!event.item.is("minecraft:compass")) return

    const currentUUID = Game.players[Game.turnIndex]
    if (player.uuid != currentUUID) {

        player.tell("§c还没到你")
        return
    }

    player.tell("§b可以移动，跳跃=上，蹲下=下，左走=左，右走=右")
})


// 每tick监听移动
PlayerEvents.tick(event => {

    if (!Game.started) return

    const player = event.player
    const currentUUID = Game.players[Game.turnIndex]

    if (player.uuid != currentUUID) return

    const piece = Game.pieces[player.uuid]
    if (!piece) return

    let moved = false

    // 前进（W）
    if (player.forward > 0) {
        piece.z--
        moved = true
    }

    // 后退（S）
    if (player.forward < 0) {
        piece.z++
        moved = true
    }

    // 左（A）
    if (player.strafe > 0) {
        piece.x--
        moved = true
    }

    // 右（D）
    if (player.strafe < 0) {
        piece.x++
        moved = true
    }

    if (!moved) return

    piece.x = Math.max(0, Math.min(Game.board.width - 1, piece.x))
    piece.z = Math.max(0, Math.min(Game.board.height - 1, piece.z))

    const worldX = Game.board.originX + piece.x + 0.5
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + piece.z + 0.5

    player.server.runCommandSilent(
        `tp @e[type=minecraft:armor_stand,name="${player.name.string}"] ${worldX} ${worldY} ${worldZ}`
    )

    Game.turnIndex++
    if (Game.turnIndex >= Game.players.length) {
        Game.turnIndex = 0
    }
})

