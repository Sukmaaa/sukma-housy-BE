const { Transaction, Houses, City } = require('../../models');
const joi = require('joi');

//Get all transaction
exports.getOrders = async (req, res) => {
    try {
        let resultOrders = await Transaction.findAll({
            include: {
                model: Houses,
                as: 'house',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'city_id'],
                },
                include: {
                    model: City,
                    as: 'city',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'house_id'],
            },
        });

        res.status(200).json({
            status: 200,
            message: 'Successfully',
            data: resultOrders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
};

//Get transaction
exports.getOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const resultOrder = await Transaction.findOne({
            where: { id },
            include: {
                model: Houses,
                as: 'house',
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'city_id'],
                },
                include: {
                    model: City,
                    as: 'city',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'house_id'],
            },
        });

        if (!resultOrder) {
            return res.status(404).json({
                status: 404,
                message: 'Order Not Found!',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully',
            data: resultOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
};

//Create Transaction
exports.createOrder = async (req, res) => {
    try {
        const payload = req.body;
        const createOrderSchema = joi.object({
            checkin: joi.date().required(),
            checkout: joi.date().required(),
            attachment: joi.string().required(),
            total: joi.number().required(),
            status: joi.number().required(),
            house_id: joi.number().required(),
        });

        const { error } = createOrderSchema.validate(payload);

        if (error) {
            return res.send({
                status: 'failed',
                message: error.details[0].message,
            });
        }

        const resultCreated = await Transaction.create({
            ...payload,
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

//Update Transaction
exports.updateOrder = async (req, res) => {
    try {
        const payload = req.body;
        const { id } = req.params;

        const editOrderSchema = joi.object({
            checkin: joi.date(),
            checkout: joi.date(),
            attachment: joi.string(),
            total: joi.number(),
            status: joi.number(),
            house_id: joi.number(),
        });

        const { error } = editOrderSchema.validate(payload);

        if (error) {
            return res.send({
                status: 'failed',
                message: error.details[0].message,
            });
        }

        const newPayload =
        {
            ...payload
        }

        await Transaction.update(newPayload, {
            where: {
                id,
            },
        });

        res.status(200).json({
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

//Delete Transaction
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const resultDelete = await Transaction.destroy({ where: { id } });

        if (!resultDelete) {
            return res.status(404).json({
                status: 404,
                message: 'Order Not Found!',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully Deleted',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
        });
    }
};
