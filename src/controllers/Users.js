const bcrypt = require('bcrypt');
const { User } = require('../../models');

//FindAll Users
exports.users = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });
    res.status(200).json({
      status: 200,
      message: 'successfully',
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//Delete Users
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userDelete = await User.destroy({ where: { id } });
    if (!userDelete) {
      return res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'successfully deleted',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
