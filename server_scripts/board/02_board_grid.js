var BoardGrid = (function () {

    function inBounds(x, z) {
        return x >= 0 &&
               x < BOARD_CONFIG.WIDTH &&
               z >= 0 &&
               z < BOARD_CONFIG.HEIGHT
    }

    function key(x, z) {
        return x + "," + z
    }

    function getCell(x, z) {
        if (!inBounds(x, z)) return null
        return BoardState.getGrid()[x][z]
    }

    function setCell(x, z, type) {
        if (!inBounds(x, z)) return
        BoardState.getGrid()[x][z] = type
    }

    function isObstacle(x, z) {
        return BoardState.getObstacles().has(key(x, z))
    }

    function isSpring(x, z) {
        return BoardState.getSprings().has(key(x, z))
    }

    function toWorldPos(x, z) {
        return {
            x: BOARD_CONFIG.WORLD_ORIGIN_X + x * BOARD_CONFIG.CELL_SPACING,
            y: BOARD_CONFIG.WORLD_ORIGIN_Y,
            z: BOARD_CONFIG.WORLD_ORIGIN_Z + z * BOARD_CONFIG.CELL_SPACING
        }
    }

    return {
        inBounds: inBounds,
        key: key,
        getCell: getCell,
        setCell: setCell,
        isObstacle: isObstacle,
        isSpring: isSpring,
        toWorldPos: toWorldPos
    }

})()
