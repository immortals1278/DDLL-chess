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
    if (Game.obstacles.includes(key)) {
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

    //player.tell(`§a已移动到 ${piece.x}, ${piece.z}`)

    // 到达底部
if (piece.z === Game.board.height - 1) {
    piece.reachedEnd = true
    player.tell("§b获得宝藏,尽快返回起点")
    event.level.runCommandSilent(
        `title @a title {"text":"${player.name.string} 拿到宝藏！","color":"blue","bold":true}`
    )
}

// 如果已经到过终点，并且回到起点
if (piece.reachedEnd && piece.z === 0) {

    event.level.runCommandSilent(
        `say §6${player.name.string} 获胜！`
    )
    event.level.runCommandSilent(
        `title @a title {"text":"${player.name.string} 获胜！","color":"gold","bold":true}`
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
    if (Game.obstacles.includes(key)) {
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
    Game.obstacles.push(key)

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

//跳板逻辑
ItemEvents.rightClicked(event => {

    const player = event.player
    const level = event.level
    const uuid = player.uuid

    if (!Game.started) return
    if (!event.item.is("minecraft:slime_ball")) return

    // 必须轮到当前玩家
    const currentUUID = Game.players[Game.turnIndex]
    if (uuid !== currentUUID) {
        player.tell("§c还没到你")
        return
    }

    const piece = Game.pieces[uuid]
    if (!piece) return

    let jumped = false
    let newZ = piece.z

    // ===== 向前跳 =====
    let frontPad = `${piece.x},${piece.z + 1}`
    if (Game.jumpPads.has(frontPad)) {

        newZ = piece.z + 2
        jumped = true
    }

    // ===== 向后跳 =====
    let backPad = `${piece.x},${piece.z - 1}`
    if (!jumped && Game.jumpPads.has(backPad)) {

        newZ = piece.z - 2
        jumped = true
    }

    if (!jumped) {
        player.tell("§c前后没有跳板")
        return
    }

    // ===== 边界检测 =====
    if (newZ < 0 || newZ >= Game.board.height) {
        player.tell("§c不能跳出棋盘")
        return
    }

    const key = `${piece.x},${newZ}`

    // ===== 障碍检测 =====
    if (Game.obstacles.includes(key)) {
        player.tell("§c落点有障碍")
        return
    }

    // ===== 棋子检测 =====
    for (let id in Game.pieces) {
        if (id === uuid) continue
        const p = Game.pieces[id]
        if (p.x === piece.x && p.z === newZ) {
            player.tell("§c落点有棋子")
            return
        }
    }

    // ===== 检查当前脚下是否是跳板 =====

    


    // ===== 通过检测，执行跳跃 =====
    piece.z = newZ

    const worldX = Game.board.originX + piece.x * 2
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + piece.z * 2

    player.server.runCommandSilent(
        `execute as @e[type=minecraft:armor_stand,tag=${piece.tag}] run tp @s ${worldX} ${worldY} ${worldZ}`
    )

    player.tell("§a跳跃成功")

    // ===== 消耗回合 =====
    Game.turnIndex++
    if (Game.turnIndex >= Game.players.length) {
        Game.turnIndex = 0
    }
})


//切换方块
BlockEvents.rightClicked(event => {

    const player = event.player
    const level = event.level
    const uuid = player.uuid

    if (!Game.started) return
    if (player.mainHandItem.id !== "minecraft:bread") return

    // 必须轮到当前玩家
    const currentUUID = Game.players[Game.turnIndex]
    if (uuid !== currentUUID) {
        player.tell("§c还没到你")
        return
    }

    const bx = event.block.pos.x
    const by = event.block.pos.y
    const bz = event.block.pos.z

    // 检查是否是那三个坐标之一
    let valid = Game.togglePads.find(p => 
        p.x === bx && p.y === by && p.z === bz
    )

    if (!valid) return

    const blockId = event.block.id

    // ===== 切换逻辑 =====
    const gridX = Math.floor((bx - Game.board.originX) / 2)
    const gridZ = Math.floor((bz - Game.board.originZ) / 2)
    const key = `${gridX},${gridZ}`

    if (blockId === "minecraft:slime_block") {

        level.runCommandSilent(
            `setblock ${bx} ${by} ${bz} minecraft:obsidian`
        )

        // ✅ 从跳板集合移除
        Game.jumpPads.delete(key)

        // ✅ 加入障碍集合
        Game.obstacles.push(key)

        player.tell("§c跳板已变为障碍")

    } else if (blockId === "minecraft:obsidian") {

        level.runCommandSilent(
            `setblock ${bx} ${by} ${bz} minecraft:slime_block`
        )

        // ✅ 从障碍集合移除
        Game.obstacles = Game.obstacles.filter(k => k !== key)

        // ✅ 加入跳板集合
        Game.jumpPads.add(key)

        player.tell("§a障碍已变为跳板")

    } else {
        return
    }


    // ===== 消耗物品 =====
    //player.mainHandItem.count--

    // ===== 消耗回合 =====
    Game.turnIndex++
    if (Game.turnIndex >= Game.players.length) {
        Game.turnIndex = 0
    }

})



