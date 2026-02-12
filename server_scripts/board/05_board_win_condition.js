var WinCondition = (function () {

    function check(player) {

        var data = BoardState.getPlayers().get(player.uuid)
        if (!data) return false

        if (!data.reachedGoal &&
            data.z === BOARD_CONFIG.GOAL_ROW) {

            data.reachedGoal = true
            return false
        }

        if (data.reachedGoal &&
            data.z === BOARD_CONFIG.START_ROW) {
            return true
        }

        return false
    }

    return {
        check: check
    }

})()
