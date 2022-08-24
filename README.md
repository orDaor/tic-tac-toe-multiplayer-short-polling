## Try this tic-tac-toe multiplayer game at [Heroku](https://fierce-bastion-95723.herokuapp.com/)!
Play tic-tac-toe vs another player. Invite a Friend with a link in a private room or join a random one!
This is a SPA built with **HTML**, **CSS**, **JS**, **Node.js/Express** and **MongoDB**. Short server polling of 2s is used for fetching game status data. No frontend framework is used.

## HOW DOES IT WORK?

- There is only one **single** game web **page**, which gets continously updated by JavaScript.

- Any time, a player can join a **new room** by choosing his/her name. The room will be either a **random** one **or** a **private** one where he/she can invite another player by generating an invitation link. The **room id** and the **player number** to which a client is mapped to (game data) are contained in the **user session**.
      
- Every time a player performs a game play action, like a game move for example, an **ajax request** is sent to the server, which will save this action in the database in the room mapped to the **user session**. The **ajax response** will contain the updated game room data fetched from the database, which will be useful for updating the **DOM** accordingly.

- A player can generate a unique **invitation link**, to invite a **friend** to play with him/her by pushing the Invite Friend button. A **private room** will be created, and the player who generated this room will be the first player joining it.  When the **invited player** opens the invitation link, he/she will be asked to **choose** a **name** for joining the room. When two players play in a private room, they can alwayse access the invitation link pointing to that room for **continuing** the **game** where they left.

- When a player is assigned a room and he/she is the first player to join that room, he/she will send **requests periodically** to get the **other player data** (**name** and **symbol**). Aajax **short polling** of **2 seconds** is used. Periodic player data fetching will stop as soon as the server responds with NON falsy value, containing the other player data, which will be useful for updating the **DOM** accordingly.

- When a player is waiting for his/her turn, he/she **requests periodically** the **game status** of his room on the server. Aajax **short polling** of **2 seconds** is used. Periodic game status fetching will stop as soon as the server responds with NON falsy value, containing the updated game status data, which will be useful for updating the **DOM** accordingly.

- A player waiting for his/her turn, will be notified if the other player left the room for joining a new one.

- After 2 players finish a match in one room, they can choose to **restart** the **game** in the same room, **or** they can join a **new one**.

- When the connection with the database is established, an asynchronous process will start which **once an hour** will **remove inactive rooms** from the database.
      
**<ins>NOTE</ins>**: **only the backend code contains the actual game status of a game room**, and only the backend is able to decide whether a player won or the game ended with a draw. What the user sees on the game reflects exaclty the game data stored and processed in the backend.
