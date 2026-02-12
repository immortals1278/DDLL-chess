var PlayerActions = (function () {

    function move(player) {

        if (!TurnManager.isPlayersTurn(player)) return

        var data = BoardState.getPlayers().get(player.uuid)
        if (!data) return

        var dir = BoardRules.randomDirection()
        var target = BoardRules.applySpringJump(data.x, data.z, dir.dx, dir.dz)

        if (!BoardRules.canMoveTo(target.x, target.z)) {
            player.tell("§c无法移动")
            return
        }

        data.x = target.x
        data.z = target.z
        PieceRenderer.spawnOrMove(player)

        player.tell("§e移动到 (" + data.x + ", " + data.z + ")")

        if (WinCondition.check(player)) {
            player.tell("§6你赢了！")
            BoardState.initBoard()
            return
        }

        TurnManager.nextTurn()
    }

    function placeObstacle(player) {

        if (!TurnManager.isPlayersTurn(player)) return

        var data = BoardState.getPlayers().get(player.uuid)
        var x = data.x
        var z = data.z + 1

        if (!BoardRules.canPlaceObstacle(x, z)) {
            player.tell("§c这里不能放障碍")
            return
        }

        BoardGrid.setCell(x, z, CELL_TYPE.OBSTACLE)
        BoardState.getObstacles().add(BoardGrid.key(x, z))

        TurnManager.nextTurn()
    }

    function placeSpring(player) {

        if (!TurnManager.isPlayersTurn(player)) return

        var data = BoardState.getPlayers().get(player.uuid)
        var x = data.x
        var z = data.z + 1

        if (!BoardRules.canPlaceSpring(x, z)) {
            player.tell("§c这里不能放跳板")
            return
        }

        BoardGrid.setCell(x, z, CELL_TYPE.SPRING)
        BoardState.getSprings().add(BoardGrid.key(x, z))

        TurnManager.nextTurn()
    }

    return {
        move: move,
        placeObstacle: placeObstacle,
        placeSpring: placeSpring
    }

})()

