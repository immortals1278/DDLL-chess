var BoardRules = (function () {

    function randomDirection() {
        var index = Math.floor(Math.random() * DIRECTIONS.length)
        return DIRECTIONS[index]
    }

    function canMoveTo(x, z) {
        if (!BoardGrid.inBounds(x, z)) return false
        if (BoardGrid.isObstacle(x, z)) return false
        return true
    }

    function canPlaceObstacle(x, z) {
        if (!BoardGrid.inBounds(x, z)) return false
        if (BoardGrid.getCell(x, z) !== CELL_TYPE.EMPTY) return false
        return true
    }

    function canPlaceSpring(x, z) {
        if (!BoardGrid.inBounds(x, z)) return false
        if (BoardGrid.getCell(x, z) !== CELL_TYPE.EMPTY) return false
        return true
    }

    function applySpringJump(x, z, dx, dz) {

        var nextX = x + dx
        var nextZ = z + dz

        if (BoardGrid.isSpring(nextX, nextZ)) {
            return {
                x: nextX + dx,
                z: nextZ + dz
            }
        }

        return { x: nextX, z: nextZ }
    }

    return {
        randomDirection: randomDirection,
        canMoveTo: canMoveTo,
        canPlaceObstacle: canPlaceObstacle,
        canPlaceSpring: canPlaceSpring,
        applySpringJump: applySpringJump
    }

})()
