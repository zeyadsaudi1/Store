const mongoose = require('mongoose');
const Joi = require('joi');

const SchemaUser = new mongoose.Schema({
    phone: {
        type: String,
        maxlength: 14,
        unique: true,
        required: true
    },
    password: {
        type: String,
        maxlength: 300,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    cart: {
        id: {
            type: String,
            default: () => new mongoose.Types.ObjectId(),
            unique: true, 
        },
        item: [
            {id: { type: String, required: true},
            nameProduct: { type: String, required: true },
            img: { type: String, required: true },
            needs: {
                width: { type: Number, required: true },
                height: { type: Number, required: true },
                chainType: { type: Number, required: true },
                widthAdjustment: { type: Number, default: 0},
                heightAdjustment: { type: Number, default: 0 },
            },
            num: {
                type:Number,
                default: 1,
            },
            total_aft: { type: Number, required: true },
            total_bef: { type: Number, required: true },}
        ],
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    logged: {
        type: Boolean,
        default: true,
    },
})

const quick = mongoose.model('quickreg', SchemaUser);

const userValidationSchema = Joi.object({
    phone: Joi.string().required(),
    password: Joi.string().min(8).required(),
    cart: Joi.object({
        id: Joi.string(),
        item: Joi.array()
            .items(
                Joi.object({
                    id: Joi.string().required(),
                    nameProduct: Joi.string().required(),
                    img: Joi.string().required(),
                    needs: Joi.object({
                        width: Joi.number().required(),
                        height: Joi.number().required(),
                        chainType: Joi.number().required(),
                        widthAdjustment: Joi.number().default(0),
                        heightAdjustment: Joi.number().default(0),
                    }).required(),
                    num: Joi.number().default(1),
                    total_aft: Joi.number().required(),
                    total_bef: Joi.number().required(),
                })
            )
            .default([]),
    }),
});

const quickValud = (user) => {
    return userValidationSchema.validate(user);
}

module.exports = {
    quickValud,
    quick,
}