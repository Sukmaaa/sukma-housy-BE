const { User, Roles } = require('../../models');
const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// sign up
exports.signup = async (req, res) => {
  try {
    const dataSignup = req.body;
    const { password, email } = dataSignup;

    const registerSchema = joi.object({
      fullname: joi.string().min(3).required(),
      username: joi.string().min(3).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      role_id: joi.number().required(),
      gender: joi.string().required(),
    });

    const { error } = registerSchema.validate(dataSignup);
    console.log(dataSignup);

    if (error) {
      return res.send({
        status: 'failed',
        message: error.details[0].message,
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).send({
        status: 'failed',
        message: 'Email Already Registered',
      });
    }

    const SALT = 10;
    const hashedPassword = await bcrypt.hash(password, SALT);

    const userCreated = await User.create({
      ...dataSignup,
      password: hashedPassword,
    });

    const checkUsername = await User.findOne({
      where: {
        username: userCreated.username,
      },
      include: {
        model: Roles,
        as: 'listAs',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    });

    const token = jwt.sign(
      { id: checkUsername.id, role: checkUsername.listAs.name },
      process.env.SECRET_KEY,
    );

    return res.status(200).json({
      status: 200,
      message: 'successfully created',
      data: { username: checkUsername.username, token },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//sign in
exports.signin = async (req, res) => {
  try {
    const dataSignin = req.body;
    const { username, password } = dataSignin;

    const loginSchema = joi.object({
      username: joi.string().required(),
      password: joi.string().required(),
    });

    const { error } = loginSchema.validate(dataSignin);

    if (error) {
      return res.status(400).json({
        status: 'failed',
        message: error.details[0].message,
      });
    }

    const user = await User.findOne({
      where: {
        username,
      },
      include: {
        model: Roles,
        as: 'listAs',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    });
    if (!user) {
      return res.status(401).json({
        status: 'failed',
        message: 'Username Or Password Invalid',
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: 'failed',
        message: 'Username Or Password Invalid',
      });
    }
    console.log(user.listAs.name);
    const token = jwt.sign(
      { id: user.id, role: user.listAs.name },
      process.env.SECRET_KEY,
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully Login',
      data: {
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
