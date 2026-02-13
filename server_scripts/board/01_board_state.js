var BoardState = (function () {
    
    var grid = []
    var players = new Map()
    var obstacles = new Set()
    var springs = new Set()
    var playerOrder = []
    var currentTurnIndex = 0
    var gameStarted = false


    function initBoard() {
        

        grid = []

        for (var x = 0; x < BOARD_CONFIG.WIDTH; x++) {
            grid[x] = []
            for (var z = 0; z < BOARD_CONFIG.HEIGHT; z++) {
                grid[x][z] = CELL_TYPE.EMPTY
            }
        }

        players = new Map()
        obstacles = new Set()
        springs = new Set()
        playerOrder = []
        currentTurnIndex = 0
        gameStarted = true
    }


    /* =========================
       玩家管理核心
    ========================= */

    function addPlayer(player) {
        var id = String(player.uuid)

        player.tell(id)
        if (players.has(id)) return

        var data = {
            x: 0,
            z: playerOrder.length
        }
        player.tell("data没问题"+JSON.stringify(data))
        players.set(id, data)
        player.tell("获取id的语句没问题"+player.uuid.toString())
        player.tell("根据id获取data语句没问题"+JSON.stringify(players.get(id)))
        playerOrder.push(id)
        player.tell("add key type: " + typeof id)

        player.tell("§a已加入棋局")
    }

    function getPlayerData(player) {
        var id = String(player.uuid)

        player.tell("get key type: " + typeof id)

        player.tell("这里能获取到id"+id)
        player.tell("players大小"+players.size)
        player.tell("这个函数中能得到data"+JSON.stringify(players.get(id)))
        return players.get(id)
    }



    function removePlayer(player) {
        var id = player.uuid
        players.delete(id)

        var index = playerOrder.indexOf(id)
        if (index !== -1) {
            playerOrder.splice(index, 1)
        }
    }


    


    function setPlayerPosition(player, x, z) {
        var data = players.get(player.uuid)
        if (!data) return

        data.x = x
        data.z = z
    }


    function hasPlayer(player) {
        return players.has(player.uuid)
    }


    /* =========================
       Getter 区域
    ========================= */

    function getGrid() { return grid }
    function getPlayers() { return players }
    function getObstacles() { return obstacles }
    function getSprings() { return springs }
    function getPlayerOrder() { return playerOrder }

    function getTurnIndex() { return currentTurnIndex }
    function setTurnIndex(i) { currentTurnIndex = i }

    function isGameStarted() { return gameStarted }


    return {
        initBoard: initBoard,

        addPlayer: addPlayer,
        removePlayer: removePlayer,
        getPlayerData: getPlayerData,
        setPlayerPosition: setPlayerPosition,
        hasPlayer: hasPlayer,

        getGrid: getGrid,
        getPlayers: getPlayers,
        getObstacles: getObstacles,
        getSprings: getSprings,
        getPlayerOrder: getPlayerOrder,
        getTurnIndex: getTurnIndex,
        setTurnIndex: setTurnIndex,
        isGameStarted: isGameStarted
    }

})()

