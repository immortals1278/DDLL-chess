ServerEvents.loaded(function(event) {

    console.info("[Chess] Server loaded event fired")

    GameController.startGame(event.server)

})


PlayerEvents.loggedIn(function(event) {

    console.info("[Chess] Player login event fired")

    GameController.playerJoin(event.player)

})
