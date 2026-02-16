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
    pieces: {}, // uuid -> {x,z,entity}
    moveMode: {}, // uuid -> true/false
    obstacles: new Set(), // 存 "x,z"
    jumpPads: new Set([
    "0,3",
    "2,3",
    "4,3"
    ]),
    togglePads: [
    {x:1, y:-49, z:7},
    {x:5, y:-49, z:7},
    {x:9, y:-49, z:7}
    ],
    obstacles: [],



}

// ===============================
//  生成棋盘
// ===============================

function generateBoard(level, player) {

    const baseX = 1
    const baseY = Game.board.originY
    const baseZ = 1

    Game.board.originX = baseX
    Game.board.originZ = baseZ

    Game.board.width = 5
    Game.board.height = 8

    const endX = baseX + (Game.board.width * 2 - 1)
    const endZ = baseZ + (Game.board.height * 2 - 1)

    // 1️⃣ 先铺满大底板
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ} ${endX} ${baseY} ${endZ} minecraft:white_concrete`
    )

    // 2️⃣ 清除间隔格
    //行
    level.runCommandSilent(
        `fill ${baseX+1} ${baseY} ${baseZ} ${baseX+1} ${baseY} ${endZ} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX+3} ${baseY} ${baseZ} ${baseX+3} ${baseY} ${endZ} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX+5} ${baseY} ${baseZ} ${baseX+5} ${baseY} ${endZ} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX+7} ${baseY} ${baseZ} ${baseX+7} ${baseY} ${endZ} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX+9} ${baseY} ${baseZ} ${baseX+9} ${baseY} ${endZ} air replace minecraft:white_concrete`
    )
    //列
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+1} ${endX} ${baseY} ${baseZ+1} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+3} ${endX} ${baseY} ${baseZ+3} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+5} ${endX} ${baseY} ${baseZ+5} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+7} ${endX} ${baseY} ${baseZ+7} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+9} ${endX} ${baseY} ${baseZ+9} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+11} ${endX} ${baseY} ${baseZ+11} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+13} ${endX} ${baseY} ${baseZ+13} air replace minecraft:white_concrete`
    )
    level.runCommandSilent(
        `fill ${baseX} ${baseY} ${baseZ+15} ${endX} ${baseY} ${baseZ+15} air replace minecraft:white_concrete`
    )

    // 跳板
    level.runCommandSilent(
        `setblock 1 -49 7 minecraft:slime_block`
    )
    level.runCommandSilent(
        `setblock 5 -49 7 minecraft:slime_block`
    )
    level.runCommandSilent(
        `setblock 9 -49 7 minecraft:slime_block`
    )

    level.runCommandSilent("say 棋盘生成完成")

    //获得物品
    level.runCommandSilent(
        `give @a minecraft:cobblestone{CanPlaceOn:["minecraft:white_concrete"]} 3`
    )
    level.runCommandSilent(
        `give @a minecraft:compass 1`
    )
    level.runCommandSilent(
        `give @a minecraft:redstone 1`
    )
    level.runCommandSilent(
        `give @a minecraft:lapis_lazuli 1`
    )
    level.runCommandSilent(
    `give @a minecraft:iron_ingot 1`
    )
    level.runCommandSilent(
        `give @a minecraft:gold_ingot 1`
    )
    level.runCommandSilent(
        `give @a minecraft:slime_ball 1`
    )
    level.runCommandSilent(
        `give @a minecraft:bread 1`
    )
    



}







// ===============================
//  生成棋子
// ===============================

function spawnPiece(player) {

    if (Game.pieces[player.uuid]) return

    const tag = `piece_${player.uuid}`

    Game.pieces[player.uuid] = {
        x: 0,
        z: 0,
        tag: tag,
        reachedEnd: false
    }

    const worldX = Game.board.originX + 0.5
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + 0.5

    player.server.runCommand(
    `summon minecraft:armor_stand ${worldX} ${worldY} ${worldZ} {
        Tags:["player_piece","${tag}"],
        CustomName:'{"text":"${player.name.string}"}',
        CustomNameVisible:1b,
        NoGravity:1b,
        Invisible:0b,
        ArmorItems:[
            {id:"minecraft:iron_boots",Count:1b},
            {id:"minecraft:iron_leggings",Count:1b},
            {id:"minecraft:iron_chestplate",Count:1b},
            {id:"minecraft:jack_o_lantern",Count:1b}
        ],
        HandItems:[
            {id:"minecraft:diamond_sword",Count:1b},
            {}
        ]
    }`
)

}




// ===============================
//  开始游戏
// ===============================

function startGame(level, firstPlayer) {

    if (Game.started) return
    if (!firstPlayer) return

    Game.started = true
    Game.turnIndex = 0

    // 🔥 关键：复制当前在线玩家
    Game.players = level.server.players.map(p => p.uuid)

    if (Game.players.length === 0) {
        level.runCommandSilent("say 没有玩家")
        Game.started = false
        return
    }

    generateBoard(level, firstPlayer)

    // 给所有玩家生成棋子
    Game.players.forEach(uuid => {
        const p = level.server.getPlayer(uuid)
        if (p) spawnPiece(p)
    })

    level.runCommandSilent("say 游戏开始")
}


function endGame(level) {

    Game.started = false
    Game.turnIndex = 0
    Game.moveMode = {}
    Game.pieces = {}

    level.runCommandSilent(
        `kill @e[type=minecraft:armor_stand,tag=player_piece]`
    )//只沙了一个人，只有一个tag

    level.runCommandSilent("say §c游戏结束")

    Game.obstacles.forEach(key => {

    const [x,z] = key.split(",").map(Number)

    const worldX = Game.board.originX + x * 2
    const worldY = Game.board.originY + 1
    const worldZ = Game.board.originZ + z * 2

    level.runCommandSilent(
        `setblock ${worldX} ${worldY} ${worldZ} air`
    )
})

Game.obstacles.clear()


}


