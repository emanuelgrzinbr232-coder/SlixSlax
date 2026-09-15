const express = require("express");

const db = require("../Banco de dados/database");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();


// PEGAR O PRÓPRIO PERFIL

router.get("/me", authMiddleware, (req, res) => {

  const user = db.prepare(`
    SELECT
      id,
      username,
      email,
      birth_date,
      avatar,
      bio,
      level,
      xp,
      created_at
    FROM users
    WHERE id = ?
  `).get(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: "Usuário não encontrado."
    });
  }

  res.json({
    user
  });
});


// ATUALIZAR PERFIL

router.put("/me", authMiddleware, (req, res) => {

  const {
    bio,
    avatar
  } = req.body;

  db.prepare(`
    UPDATE users
    SET
      bio = COALESCE(?, bio),
      avatar = COALESCE(?, avatar)
    WHERE id = ?
  `).run(
    bio ?? null,
    avatar ?? null,
    req.user.id
  );

  const user = db.prepare(`
    SELECT
      id,
      username,
      email,
      birth_date,
      avatar,
      bio,
      level,
      xp,
      created_at
    FROM users
    WHERE id = ?
  `).get(req.user.id);

  res.json({
    message: "Perfil atualizado!",
    user
  });
});

module.exports = router;
