// 玩家进入
PlayerEvents.loggedIn(event => {

    const player = event.player

    if (!Game.players.includes(player.uuid)) {
        Game.players.push(player.uuid)
    }

    

})

//按钮开始游戏
BlockEvents.rightClicked(event => {

    if (Game.started) return

    const player = event.player
    const level = event.level
    const block = event.block

    if (!block.id.includes("button")) return

    const pos = block.pos

    //if (pos.x == 0 && pos.y == -60 && pos.z == 0) {

        startGame(level, player)
        level.runCommandSilent("say 游戏正式开始")
    //}
})



// 指南针进入移动模式
ItemEvents.rightClicked(event => {

    const player = event.player

    if (!Game.started) {
        player.tell("§c游戏还没开始")
        return
    }

    if (!event.item.is("minecraft:compass")) return

    const currentUUID = Game.players[Game.turnIndex]
    if (player.uuid != currentUUID) {
        player.tell("§c还没到你")
        return
    }

    Game.moveMode[player.uuid] = true
    player.tell("§a移动模式开启")
    player.tell("§7红石=后  青金石=前  铁=右  金=左")
})

ItemEvents.rightClicked(event => {

    const player = event.player
    const uuid = player.uuid

    if (!Game.moveMode[uuid]) return

    const piece = Game.pieces[uuid]
    if (!piece) return

    let moved = false

    if (event.item.is("minecraft:redstone")) {
        piece.z--
        moved = true
    }

    if (event.item.is("minecraft:lapis_lazuli")) {
        piece.z++
        moved = true
    }

    if (event.item.is("minecraft:iron_ingot")) {
        piece.x--
        moved = true
    }

    if (event.item.is("minecraft:gold_ingot")) {
        piece.x++
        moved = true
    }

    if (!moved) return

    // 边界限制
    piece.x = Math.max(0, Math.min(Game.board.width - 1, piece.x))
    piece.z = Math.max(0, Math.min(Game.board.height - 1, piece.z))

    const worldX = Game.board.originX + piece.x * 2 
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + piece.z * 2 

    player.server.runCommandSilent(
    `execute as @e[type=minecraft:armor_stand,tag=${piece.tag}] run tp @s ${worldX} ${worldY} ${worldZ}`
)

    player.tell(`§a已移动到 ${piece.x}, ${piece.z}`)

    // 关闭移动模式
    Game.moveMode[uuid] = false
    player.tell("§e移动完成")

    // 切换回合
    Game.turnIndex++
    if (Game.turnIndex >= Game.players.length) {
        Game.turnIndex = 0
    }
})




