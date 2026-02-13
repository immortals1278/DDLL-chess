var BoardGrid = {

    toWorldPos(x, z) {
        return {
            x: BOARD_CONFIG.WORLD_ORIGIN_X + x * BOARD_CONFIG.CELL_SPACING,
            y: BOARD_CONFIG.WORLD_ORIGIN_Y,
            z: BOARD_CONFIG.WORLD_ORIGIN_Z + z * BOARD_CONFIG.CELL_SPACING
        }
    }

}
