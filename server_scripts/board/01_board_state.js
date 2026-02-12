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
