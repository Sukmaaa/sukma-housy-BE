const { Roles } = require('../../models');

//get Role
exports.getRoles = async (req, res) => {
  try {
    const roles = await Roles.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully',
      data: roles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//Create Role
exports.createRole = async (req, res) => {
  try {
    const resultCreated = await Roles.create(req.body);

    res.status(200).json({
      status: 200,
      message: 'Successfully',
      data: {
        name: resultCreated.name,
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
