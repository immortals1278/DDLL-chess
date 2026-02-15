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

    if (pos.x == 0 && pos.y == -60 && pos.z == 0) {

        startGame(level, player)
        level.runCommandSilent("say 游戏正式开始")
    }
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

    player.tell("§b可以移动，跳跃=上，蹲下=下，左走=左，右走=右")
})



