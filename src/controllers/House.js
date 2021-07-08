const { Houses, City } = require('../../models');
const joi = require('joi');

//Get all houses
exports.getHouses = async (req, res) => {
  try {
    const { typeRent, price } = req.query;

    let resultHouses = await Houses.findAll({
      include: {
        model: City,
        as: 'city',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'city_id'],
      },
    });

    resultHouses =
      resultHouses.length > 0 ? resultHouses.map((house) => {
        return {
          ...house.dataValues,
          amenities: house.amenities.split(','),
        };
      })
        : [];

    if (typeRent) {
      resultHouses = resultHouses.filter(
        (house) => house.typeRent === typeRent,
      );
    }

    if (price) {
      resultHouses = resultHouses.filter(
        (house) => house.price <= parseInt(price),
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully',
      data: resultHouses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//Get house
exports.getHouse = async (req, res) => {
  try {
    const { id } = req.params;
    let resultHouse = await Houses.findOne({
      where: {
        id,
      },
      include: {
        model: City,
        as: 'city',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'city_id'],
      },
    });

    if (!resultHouse) {
      return res.status(404).json({
        status: 404,
        message: 'House Not Found',
      });
    }

    resultHouse = {
      ...resultHouse.dataValues,
      amenities: resultHouse.amenities.split(','),
    };

    res.status(200).json({
      status: 200,
      message: 'Successfully',
      data: resultHouse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//Create House
exports.createHouse = async (req, res) => {
  try {
    const payload = req.body;

    const houseSchema = joi.object({
      name: joi.string().required(),
      price: joi.required(),
      typeRent: joi.string().required(),
      amenities: joi.string().required(),
      address: joi.string().required(),
      bedroom: joi.number().required(),
      bathroom: joi.number().required(),
      city_id: joi.number(),
    });

    const { error } = houseSchema.validate(payload);

    if (error) {
      return res.send({
        status: 'failed',
        message: error.details[0].message,
      });
    }

    const resultCreated = await Houses.create({
      ...payload
    });

    return res.status(201).json({
      status: 201,
      message: 'successfully created',
      data: resultCreated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//Update House
exports.updateHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const editHouseSchema = joi.object({
      name: joi.string(),
      price: joi.number(),
      typeRent: joi.string(),
      amenities: joi.string(),
      address: joi.string(),
      bedroom: joi.number(),
      bathroom: joi.number(),
      city_id: joi.number(),
    });

    const { error } = editHouseSchema.validate(payload);

    if (error) {
      return res.send({
        status: 'failed',
        message: error.details[0].message,
      });
    }

    const newPayload =
    {
      ...payload,
    };

    await Houses.update(newPayload, {
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: 200,
      message: 'successfully updated',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};

//Delete House
exports.deleteHouse = async (req, res) => {
  try {
    const { id } = req.params;
    const resultDelete = await Houses.destroy({ where: { id } });
    if (!resultDelete) {
      return res.status(404).json({
        status: 404,
        message: 'House not found',
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
