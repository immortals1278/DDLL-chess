var BoardRenderer = (function () {

    function drawBoard(server) {
        

        var dim = server.overworld()
        var originX = BOARD_CONFIG.WORLD_ORIGIN_X
        var originY = BOARD_CONFIG.WORLD_ORIGIN_Y
        var originZ = BOARD_CONFIG.WORLD_ORIGIN_Z
        var space = BOARD_CONFIG.CELL_SPACING

        for (var x = 0; x < BOARD_CONFIG.WIDTH; x++) {
            for (var z = 0; z < BOARD_CONFIG.HEIGHT; z++) {

                var wx = originX + x * space
                var wz = originZ + z * space

                var pos1 = new BlockPos(wx, originY - 1, wz)
                var state1 = Block.getBlock("minecraft:smooth_stone").defaultBlockState()
                dim.setBlock(pos1, state1, 3)

                var pos2 = new BlockPos(wx, originY, wz)
                var state2 = Block.getBlock("minecraft:white_concrete").defaultBlockState()
                dim.setBlock(pos2, state2, 3)

            }
        }

        server.tell("§7棋盘已生成")
    }

    function updateCell(x, z) {

        var dim = Utils.server.overworld()
        var pos = BoardGrid.toWorldPos(x, z)
        var type = BoardGrid.getCell(x, z)

        if (type === CELL_TYPE.EMPTY) {
            var blockPos = new BlockPos(pos.x, pos.y, pos.z)
            var state = Block.getBlock("minecraft:white_concrete").defaultBlockState()
            dim.setBlock(blockPos, state, 3)
        }

        if (type === CELL_TYPE.OBSTACLE) {
            var blockPos = new BlockPos(pos.x, pos.y, pos.z)
            var state = Block.getBlock("minecraft:iron_block").defaultBlockState()
            dim.setBlock(blockPos, state, 3)
        }

        if (type === CELL_TYPE.SPRING) {
            var blockPos = new BlockPos(pos.x, pos.y, pos.z)
            var state = Block.getBlock("minecraft:slime_block").defaultBlockState()
            dim.setBlock(blockPos, state, 3)
        }
    }

    function refreshBoard() {

        for (var x = 0; x < BOARD_CONFIG.WIDTH; x++) {
            for (var z = 0; z < BOARD_CONFIG.HEIGHT; z++) {
                updateCell(x, z)
            }
        }
    }

    return {
        drawBoard: drawBoard,
        updateCell: updateCell,
        refreshBoard: refreshBoard
    }

})()

