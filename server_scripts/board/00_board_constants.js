// ===============================
// 棋盘基础参数
// ===============================

var BOARD_CONFIG = {
    WIDTH: 5,          // 列数
    HEIGHT: 8,         // 行数
    MAX_PLAYERS: 3,    // 最大玩家数

    START_ROW: 0,      // 最底行（胜利后返回的行）
    GOAL_ROW: 7,       // 最顶行（先到这里再回到底部才算赢）

    // 地图映射（以后建真实地图时用）
    WORLD_ORIGIN_X: -9,
    WORLD_ORIGIN_Y: -50,
    WORLD_ORIGIN_Z: 8,
    CELL_SPACING: 3    // 每个棋盘格之间的方块间距
}


// ===============================
// 格子类型枚举
// ===============================

var CELL_TYPE = {
    EMPTY: 0,
    OBSTACLE: 1,
    SPRING: 2
}


// ===============================
// 玩家行动类型
// ===============================

var ACTION_TYPE = {
    MOVE: "move",
    PLACE_OBSTACLE: "obstacle",
    PLACE_SPRING: "spring"
}


// ===============================
// 移动方向（逻辑方向）
// ===============================

var DIRECTIONS = [
    { name: "UP",    dx: 0,  dz: 1 },
    { name: "DOWN",  dx: 0,  dz: -1 },
    { name: "LEFT",  dx: -1, dz: 0 },
    { name: "RIGHT", dx: 1,  dz: 0 }
]


// ===============================
// 道具绑定（使用原版物品）
// ===============================

var GAME_ITEMS = {
    MOVE_ITEM: "minecraft:compass",         // 移动
    OBSTACLE_ITEM: "minecraft:cobblestone", // 障碍
    SPRING_ITEM: "minecraft:slime_ball"     // 跳板
}


// ===============================
// 游戏限制参数（平衡用）
// ===============================

var LIMITS = {
    MAX_OBSTACLES_PER_PLAYER: 5,
    MAX_SPRINGS_PER_PLAYER: 3
}
