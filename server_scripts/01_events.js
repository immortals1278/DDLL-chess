// 玩家进入


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

    let newX = piece.x
    let newZ = piece.z
    let moved = false

    if (event.item.is("minecraft:redstone")) {
        newZ--
        moved = true
    }

    if (event.item.is("minecraft:lapis_lazuli")) {
        newZ++
        moved = true
    }

    if (event.item.is("minecraft:iron_ingot")) {
        newX--
        moved = true
    }

    if (event.item.is("minecraft:gold_ingot")) {
        newX++
        moved = true
    }

    if (!moved) return

    // ===== 边界检测 =====
    if (newX < 0 || newX >= Game.board.width ||
        newZ < 0 || newZ >= Game.board.height) {
        player.tell("§c不能越界")
        return
    }

    // ===== 障碍检测 =====
    const key = `${newX},${newZ}`
    if (Game.obstacles.has(key)) {
        player.tell("§c前方有障碍物")
        return
    }

    // ===== 棋子碰撞检测 =====
    for (let id in Game.pieces) {
        if (id === uuid) continue
        const p = Game.pieces[id]
        if (p.x === newX && p.z === newZ) {
            player.tell("§c那里有其他棋子")
            return
        }
    }

    // ===== 所有检测通过后才真正赋值 =====
    piece.x = newX
    piece.z = newZ


    const worldX = Game.board.originX + piece.x * 2 
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + piece.z * 2 

    player.server.runCommandSilent(
    `execute as @e[type=minecraft:armor_stand,tag=${piece.tag}] run tp @s ${worldX} ${worldY} ${worldZ}`
)

    player.tell(`§a已移动到 ${piece.x}, ${piece.z}`)

    // 到达底部
if (piece.z === Game.board.height - 1) {
    piece.reachedEnd = true
    player.tell("§b已到达终点，返回起点即可获胜")
}

// 如果已经到过终点，并且回到起点
if (piece.reachedEnd && piece.z === 0) {

    event.level.runCommandSilent(
        `say §6${player.name.string} 获胜！`
    )

    endGame(event.level)
    return
}

    // 关闭移动模式
    Game.moveMode[uuid] = false
    player.tell("§e移动完成")

    // 切换回合
    Game.turnIndex++
    if (Game.turnIndex >= Game.players.length) {
        Game.turnIndex = 0
    }
})


BlockEvents.rightClicked(event => {

    const player = event.player
    const level = event.level
    const uuid = player.uuid

    if (!Game.started) return

    // 必须轮到当前玩家
    const currentUUID = Game.players[Game.turnIndex]
    if (uuid !== currentUUID) {
        player.tell("§c还没到你")
        return
    }

    // 必须手持圆石
    if (player.mainHandItem.id !== "minecraft:cobblestone") return

    const bx = event.block.pos.x
    const bz = event.block.pos.z

    // 转换为棋盘坐标
    const gridX = Math.floor((bx - Game.board.originX) / 2)
    const gridZ = Math.floor((bz - Game.board.originZ) / 2)

    // 范围检测
    if (gridX < 0 || gridX >= Game.board.width ||
        gridZ < 0 || gridZ >= Game.board.height) {
        player.tell("§c不在棋盘范围")
        return
    }

    const key = `${gridX},${gridZ}`

    // 已有障碍
    if (Game.obstacles.has(key)) {
        player.tell("§c这里已有障碍")
        return
    }

    // 有棋子
    for (let id in Game.pieces) {
        const p = Game.pieces[id]
        if (p.x === gridX && p.z === gridZ) {
            player.tell("§c这里有棋子")
            return
        }
    }

    // ===== 放置障碍 =====
    Game.obstacles.add(key)

    const worldX = Game.board.originX + gridX * 2
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + gridZ * 2

    level.runCommandSilent(
        `setblock ${worldX} ${worldY} ${worldZ} minecraft:obsidian`
    )

    player.tell("§7已放置障碍，回合结束")

    // ===== 消耗物品 =====
    player.mainHandItem.count--

    // ===== 切换回合 =====
    Game.turnIndex++
    if (Game.turnIndex >= Game.players.length) {
        Game.turnIndex = 0
    }
})




