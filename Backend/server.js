require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("../Rotas/auth");
const usersRoutes = require("../Rotas/users");
const communitiesRoutes = require("../Rotas/communities");
const gamesRoutes = require("../Rotas/games");
const videosRoutes = require("../Rotas/videos");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));


// ===============================
// ROTAS DA API
// ===============================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  usersRoutes
);

app.use(
  "/api/communities",
  communitiesRoutes
);

app.use(
  "/api/games",
  gamesRoutes
);

app.use(
  "/api/videos",
  videosRoutes
);


// ===============================
// TESTE DA API
// ===============================

app.get("/api/health", (req, res) => {

  res.json({
    online: true,
    name: "SlixSlax API",
    version: "1.0.0"
  });

});


// ===============================
// FRONTEND
// ===============================

app.use(
  express.static(
    path.join(__dirname, "../Frontend")
  )
);

app.get("*splat", (req, res) => {

  res.sendFile(
    path.join(
      __dirname,
      "../Frontend/index.html"
    )
  );

});


// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, () => {

  console.log("");
  console.log("================================");
  console.log("       SLIXSLAX ONLINE");
  console.log("================================");
  console.log(
    `Servidor: http://localhost:${PORT}`
  );
  console.log(
    `API: http://localhost:${PORT}/api/health`
  );
  console.log("================================");
  console.log("");

});
