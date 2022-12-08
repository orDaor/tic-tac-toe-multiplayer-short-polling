| **GAME VIEW** |
| ------------- |
| ![Game view](assets/game-view-3.PNG?raw=true)  | 

## Try this tic-tac-toe multiplayer game at Heroku [<ins>Here</ins>](https://fierce-bastion-95723.herokuapp.com/)!
Play tic-tac-toe vs another player. Invite a Friend with a link in a private room or join a random one!
This application is built with **HTML**, **CSS**, **JS**, **Node.js/Express** and **MongoDB**. Short server **polling** of 2s is used for fetching game status data. No frontend framework is used.

## HOW DOES IT WORK?

There is one **main** web **page**, where the DOM gets continuously updated by JavaScript.

### Game Rooms
- Any time, a player can join a **new room** by choosing his/her name. The room will be either a **random** one **or** a **private** one where he/she can invite another player by generating an invitation link. The **room id** and the **player number** to which a client is mapped to (game data) are contained in the **user session**.
      
- Every time a player performs a game play action, like a game move for example, an **ajax request** is sent to the server, which will save this action in the database in the room mapped to the **user session**. The **ajax response** will contain the updated game room data fetched from the database, which will be useful for updating the **DOM** accordingly.

- A player can generate a unique **invitation link**, to invite a **friend** to play with him/her by pushing the Invite Friend button. A **private room** will be created, and the player who generated this room will be the first player joining it.  When the **invited player** opens the invitation link, he/she will be asked to **choose** a **name** for joining the room. When two players play in a private room, they can alwayse access the invitation link pointing to that room for **continuing** the **game** where they left.

### Game Play

- When a player is assigned a room and he/she is the first player to join that room, he/she will send **requests periodically** to get the **other player data** (**name** and **symbol**). Aajax **short polling** of **2 seconds** is used. Periodic player data fetching will stop as soon as the server responds with NON falsy value, containing the other player data, which will be useful for updating the **DOM** accordingly.

- When a player is waiting for his/her turn, he/she **requests periodically** the **game status** of his room on the server. Aajax **short polling** of **2 seconds** is used. Periodic game status fetching will stop as soon as the server responds with NON falsy value, containing the updated game status data, which will be useful for updating the **DOM** accordingly.

- A player waiting for his/her turn, will be notified if the other player left the room for joining a new one.

- After 2 players finish a match in one room, they can choose to **restart** the **game** in the same room, **or** they can join a **new one**.
      
### Game State

**Only the backend code contains the actual game status of a game room**, and only the backend is able to decide whether a player won or the game ended with a draw. What the user sees on the game reflects exaclty the game data stored and processed in the backend.

### Inactive Rooms

When the connection with the database is established, an asynchronous process will start which **once an hour** will **remove inactive rooms** from the database.

## MVC BACKEND DESIGN: ROUTES AND CONTROLLERS

**Routes** are groupped in these sets:

- base
- game config 
- game play 
- game room
- player

A **controller** is defined for each route set (except for the base routes), and each controller contains its controller actions. In the following are described the **end-points** handled by the different controller actions:

- **game config** controller:

    - **GET: “/game”** → get the main game page, which lets a user enter his/her name for joining a random room or a new private one to which invite a friend with an invitation link.
    - **GET: “/game/new/friend/roomId”** → get the page from which a user can enter his/her name to join the private room of a friend who shared this invitation link with him/her.

- **game play** controller (**ajax**):

    - **GET: “/game/room”** → the user requests the current game status of the room to which his/her session is mapped.
    - **POST: “/game/status”** → the user requests to update the game status when performing a game move.
    - **POST: “/game/restart”** → the user requests to restart the game with the same other player in the room he/she is currently in, after game is over.

- **game room** controller (**ajax**):
    - **POST: “/game/new”** → a user requests to join a random room.
    - **POST: “/game/new/friend”** → a user requests a new private room where to invite a friend with an invitation link. The link is pointing to this private room in the database.
    - **POST: “/game/new/friend/roomId”** →  a user requests to join a private room after he/she got an invitation link.

- **player** controller (**ajax**):
    - **GET: “/player/other”** → a player fetches the data of the other player in the room he/she is currently playing in.

## MONGODB DATABASE
**NoSQL** MondoDB database is used for **storing sessions and** game **rooms**:

- MondoDB **database** → **_tic-tac-toe_**

- MondoDB **collections** in _tic-tac-toe_ database:
  - _sessions_
  - _rooms_

- single MondoDB **document** in **_sessions_** collection → a standard client session. In the client session, we write to which game room the client is assigned, and which player number he/she is there (1 or 2):
  - **_id** (ObjectId) → id of the MongoDB session document.
  - **...**
  - **gameData**:
    - roomId (string)
    - playerNumber (number)

- single MondoDB **document** in **_rooms_** collection → an object of **class Room** representing a game room for 2 players.

## MVC BACKEND DESIGN: MODELS
The following are the **classes** defined in the backend for handling game rooms:

### **Room**
Represents a game room which contains 2 players and a game status with a tic-tac-toe game board:
- <ins>properties</ins>:
  - **players** (array of 2 objects of class Player)
  - **gameStatus** (GameStatus class object)
  - **availabl**e (bool) → a room is available if at least one player slot is not occupied (empty).
  - **creationDate** (Date class object)
  - **lastChangeDate**  (Date class object) → when a room is created, the last change date it is equal to creation date. Then, every time the game room data are updated, the last change date updates accordingly.
  - **blocked** (bool) → a room gets blocked when:
    - after a player leaves it, so that no other clients can be assigned to this room in the future.
    - when a client finds a random room as available and wants to “book” it. During the process where the client is being assigned to this room, the room remains blocked, in order that it could not be assigned to other clients.
  - **owned**  (bool) → private. A client creates a private room for inviting there another friend with a link.
  - **roomId**  (bool) → id of the corresponding room document in the database.

- **<ins>NOTE</ins>**: a **room** is defined as **random** and **good to be assigned** to one client when it is the **first** room in the database which **matches** the following **conditions**:
  - **room.available = TRUE**
  - **room.blocked = FALSE**
  - **room.owned = FALSE**

- **<ins>NOTE</ins>**: the **room assigning process** for a client is made of the following steps:
  - a random room document in the database is found and “booked” (blocked). If no room is found a new one is created.
  - an available (empty) player slot is found in the room.
  - a Player class object is entered in the available player slot of the room with the player name chosen by the user.
  - the room document in the database is updated with the new data. If a new room is created, a new room document is inserted in the database.
  - the room id together with the available player slot number in the room are assigned to the game data in the user session.

- <ins>methods</ins>:
  - **(static) createEmpty(isPrivate)** → creates a new empty room object, when no random room is found.
  - **(static) fromMongoDBDocumentToRoom(document)** → converts a MondoDB room document to a Room class object.
  - **(static) findAvailableAndBlock(roomIdToSkip)** → finds first available room and books it. Skips the room with the given id.
  - **(static) findById(roomId)** → fetches from the database a room with the given id.
  - **(static) findByIdAndCheckAccessRights(roomId, sessionGameData)** → checks whether a client can be assigned or access this room based on the game data of his/her session.
  - **(static) deleteByFilter(query)** → deletes all rooms in the database matching the filter.
  - **(static) deleteInactiveRoomsCiclically(delay, maxInactiveTime)** → deletes every “delay” milliseconds from the database all the rooms which have been inactive for too much time.
  - **(static) blockById(roomId)** → when a player leaves a room , it will block it, so that no other player can join it.
  - **isAvailable()** → checks if at least 1 player slot is available (empty) in this room.
  - **save()** → saves a new game room in the database which has values equal to this room object; or updates the values of an existing room in the database with the values of this room.
  - **getPlayer(playerNumber)** → returns a specific player of the room.
  - **addPlayer(Player)** → occupies a player slot with a specific Player object.
  - **removePlayer(playerNumber)** → removes one player in this room (empties the player slot).
  - **setPlayersTurn(playerNumber)** → updates player turns info in the room given that the player with playerNumber made a successfull game move.
  - **isPlayerSlotAvailable(playerNumber)** → checks if a player slot is empty.
  - **getAvailablePlayerSlot()** → checks which player slot number in this room is available (empty).
  - **getAvailableGameSymbol()** → returnes the symbol not used by players in the room yet.
  - **InitGameRestart()** → sets game restart requests for this room.
  - **isGameRestartInitialized()** → checks if a game restart in this room was already requested.
  - **handleGameRestart(playerNumber)** → handles game restart requests.
  - **fromRoomToMongoDBDocument()** → converts a Room class object to a room MongoDB document.

### **Player**
Represents a specific player inside of a room:
- <ins>properties</ins>:
  - **name** (string) → player name.
  - **symbol** (string) → X or O.
  - **number** (number) → 1 or 2.
  - **hasTurn** (bool) → whether it is this player turn or not.
  - **restartingRequest** (bool)→ request for restarting the game after game over, in the current room with the same other player.

- <ins>methods</ins>:
  - **(static) fromMongoDBDocumentToPlayer** → convert MondoDB player document to a Player class object.

### **GameMove**
Represents a move made by a certain player at a certain date, on a specified position in the game board of a room:
- <ins>properties</ins>:
  - **playerNumber** (number) → number of the player who made this move.
  - **coord** (array of 2 numbers) → coordinates (row and column) in game board where th move is set.
  - **date** (Date class object)→ date this move was made.

- <ins>methods</ins>:
  - **(static) fromMongoDBDocumentToGameMove()** → converts MondoDB game move document to a GameMove class object.

### **GameStatus**
Contains all the game state data in a specific room:
- <ins>properties</ins>:
  - **board** (array of 3 arrays of length 3) → matrix where values are 1, 2 or 0 (each value represents the player number who did the move).
  - **lastMove** (GameMove class object) → represents the last move made on the game board of this game status.

- <ins>methods</ins>:
  - **(static) fromMongoDBDocumentToGameStatus()** → converts MondoDB game status document to a GameStatus class object.
  - **makeMove(player, coord)** → updates this game status board with a move by the given player, and updates the lastMove property.
  - **getCurrentTurn()** → returns number of the player who has current turn.
  - **getGameOverStatus()** → returns object of class GameOverStatus which describes the current game over status.
  - **reset()** → resets board and last move of this game status.

### **GameOverStatus**
Used for building a game over status object to be sent by the server to the browser within the ajax response. Thi gives info to the browser on whether a player made a winner or draw game move:
- <ins>properties</ins>:
  - **isOver** (bool) → whether game is over or not.
  - **isWinner** (bool) → we have a winner!
  - **isDraw** (bool) → it is a draw!
  - **winnerCase** (number) → a number which points at the winner case (3 equal symbols in a row) which occured in case of game over.
  - **winnerPlayerNumber** (number) → the number of the player who won the game in case of game over.

### **ViewData**
A data strucure which is needed for initializing the game data and content in the game page. This contains both game meta data and game status data for a given room passed to the constructor. This data structure it is passed to the view and is useful for letting one player continuing the game in a private room, by clicking again on the invitaion link. Default view data are set in case the user is not requesting to continue any game. The value of these data depends on the player who is requsting them:

- <ins>properties</ins>:
  - **gameConfigDisplay** (string) → css display property of config game section.
  - **activeGameDisplay** (string) → css display property of active game section.
  - **gameOverStatusDisplay** (string) → css display property of game over status element.
  - **gameOverStatusText** (string) → of game over status text.
  - **gameTurnInfoDisplay** (string) → css display property of game turn element.
  - **player1Name** (string) 
  - **player2Name** (string) 
  - **player1Symbol** (string) 
  - **player2Symbol** (string) 
  - **player1Number** (string) 
  - **player2Number** (string) 
  - **isOtherPlayerConnected** (bool)
  - **activePlayerName** (string) → name of the player who has the current turn.
  - **activePlayerNameNextSibling** (string) → “ _’s_ ”
  - **activeGameButtonsDisplay** (string) → css display property of active game buttons element.
  - **isYourTurn** (bool) → whether the turn is of the player who requested this data or not.
  - **yourPlayerName** (string) → the name of the player who is requesting these data.
  - **yourPlayerSymbol** (string) → the symbol of the player who is requesting these data.
  - **continueGame** (bool) → whether the user is requesting or not to continue a game in this room for which data are requested.
  - **isGameOver** (bool) → whether the game is over or not in this room for which data are requested.
  - **invitationUrl** (string) → invitation link to this room for which data are requested.
  - **boardCellsList** (array of GameBoardCellData objects) → encodes the status of one game board cells in the page.

### **GameBoardCellData**
A data structure representing how a specific game board cell should be displayed in the game page:
- <ins>properties</ins>:
  - **row** (number) → row number.
  - **col** (number) → column number.
  - **symbol** (string) → cell content (X or O).
  - **cssClass** (number)→ CSS class applied in the cell in the page.

## 3-RD PARTY PACKAGES
The following Node.js 3-rd party packages are used for building the backend code:
- express
- express-session
- mongodb
- connect-mongodb-session
- csurf
- ejs