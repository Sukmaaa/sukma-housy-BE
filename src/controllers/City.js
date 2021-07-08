const { Op } = require('sequelize');
const { City } = require('../../models');

exports.cities = async (req, res) => {
  try {
    const { cities } = req.query;

    let checkCities;
    if (!cities) {
      checkCities = await City.findAll();
    } else {
      checkCities = await City.findAll({
        where: {
          name: {
            [Op.substring]: cities,
          },
        },
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Successfully',
      data: checkCities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
