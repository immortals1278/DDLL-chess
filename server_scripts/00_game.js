// ===============================
//  游戏运行时数据（纯 JS 对象）
// ===============================

const Game = {
    started: false,
    players: [],
    turnIndex: 0,
    board: {
        width: 8,
        height: 5,
        originX: 0,
        originY: -50,
        originZ: 0
    },
    pieces: {} // uuid -> {x,z,entity}
}

// ===============================
//  生成棋盘
// ===============================

function generateBoard(level, player) {

    const baseX = Math.floor(player.x)
    const baseY = Game.board.originY
    const baseZ = Math.floor(player.z)

    Game.board.originX = baseX
    Game.board.originZ = baseZ

    for (let x = 0; x < Game.board.width; x++) {
        for (let z = 0; z < Game.board.height; z++) {

            const worldX = baseX + x
            const worldZ = baseZ + z

            level.setBlockAndUpdate(
                BlockPos(worldX, baseY, worldZ),
                Block.getBlock("minecraft:white_concrete").defaultBlockState()
            )
        }
    }

    level.runCommandSilent("say 棋盘生成完成")
}





// ===============================
//  生成棋子
// ===============================

function spawnPiece(player) {

    if (Game.pieces[player.uuid]) return

    Game.pieces[player.uuid] = {
        x: 0,
        z: 0
    }

    const worldX = Game.board.originX + 0.5
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + 0.5

    player.server.runCommandSilent(
        `/summon minecraft:armor_stand ${worldX} ${worldY} ${worldZ} {CustomName:'{"text":"${player.name.string}"}',CustomNameVisible:1b,NoGravity:1b}`
    )
}


// ===============================
//  开始游戏
// ===============================

function startGame(level, firstPlayer) {

    if (Game.started) return
    if (!firstPlayer) return

    Game.started = true

    generateBoard(level, firstPlayer)

    const p = level.server.getPlayer(firstPlayer.uuid)
    if (p) spawnPiece(p)

    level.runCommandSilent(`say 游戏开始`)
}


