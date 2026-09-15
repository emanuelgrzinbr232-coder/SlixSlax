const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../Banco de dados/database");

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}


// ===============================
// CADASTRO
// ===============================

router.post("/register", async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      birth_date
    } = req.body;

    if (!username || !email || !password || !birth_date) {
      return res.status(400).json({
        error: "Preencha todos os campos."
      });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        error: "O usuário precisa ter entre 3 e 20 caracteres."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "A senha precisa ter pelo menos 8 caracteres."
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedUsername =
      username.trim();

    const existing = db.prepare(`
      SELECT id
      FROM users
      WHERE email = ?
      OR username = ?
    `).get(
      normalizedEmail,
      normalizedUsername
    );

    if (existing) {
      return res.status(409).json({
        error: "Esse usuário ou e-mail já está cadastrado."
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const result = db.prepare(`
      INSERT INTO users
      (
        username,
        email,
        password,
        birth_date
      )
      VALUES (?, ?, ?, ?)
    `).run(
      normalizedUsername,
      normalizedEmail,
      passwordHash,
      birth_date
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
    `).get(result.lastInsertRowid);

    const token = createToken(user);

    res.status(201).json({
      message: "Conta criada com sucesso!",
      token,
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao criar a conta."
    });
  }
});


// ===============================
// LOGIN
// ===============================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Informe seu e-mail e senha."
      });
    }

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE email = ?
    `).get(
      email.trim().toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos."
      });
    }

    const passwordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordCorrect) {
      return res.status(401).json({
        error: "E-mail ou senha incorretos."
      });
    }

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      birth_date: user.birth_date,
      avatar: user.avatar,
      bio: user.bio,
      level: user.level,
      xp: user.xp,
      created_at: user.created_at
    };

    const token = createToken(safeUser);

    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: safeUser
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erro ao fazer login."
    });
  }
});

module.exports = router;
