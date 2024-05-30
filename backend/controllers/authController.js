import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const tokenCredential = req.user;
  if (tokenCredential.role === "member")
    return res.status(403).json({ msg: "Only the superadmin can add admin" });

  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and confirmation password do not match" });

  const emailExisted = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (emailExisted)
    return res.status(400).json({ msg: "Email already registered" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "admin",
    });
    res.json({ msg: "Register successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const RegisterMember = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and confirmation password do not match" });

  const emailExisted = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (emailExisted)
    return res.status(400).json({ msg: "Email already registered" });

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "member",
    });
    res.json({ msg: "Register successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    if (!user) return res.status(404).json({ msg: "Email not found" });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    req.session.userId = user[0].uuid;
    const uuid = user[0].uuid;
    const name = user[0].name;
    const email = user[0].email;
    const role = user[0].role;

    const accessToken = jwt.sign(
      { uuid, name, email, role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { uuid, name, email, role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await Users.update(
      { refresh_token: refreshToken },
      {
        where: { uuid: uuid },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ msg: "An error occurred", error: error.message });
  }
};

export const Logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Cannot logout" });
    res.status(200).json({ msg: "You already log out" });
  });
};
