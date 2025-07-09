const mongoose = require("mongoose");
const Joi = require("joi");

const CurtainsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,  // تأكد من أنه حقل مطلوب
        unique: true
    },
    desc: {
        type: String,
        default: null
    },
    bef_price_per_meter: {
        type: Number,  // تغيير النوع إلى Number بدلاً من String
        required: true,
    },
    aft_price_per_meter: {
        type: Number,  // تغيير النوع إلى Number بدلاً من String
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    percentage_tpye: {
        type: String,
        required: true,
    },
    percentage: {
        type: String,
        required: true,
    },
    pattern: {
        type: String,
    },
    warranty: {
        type: String,
    },
    recomment: {
        type: String,
        maxlength: 250,
    },
    exec_from: {
        type: Number,
        min: 1,
    },
    exec_to: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    offers: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    imgsUrl: { 
        type: [String],  
        required: true,
        match: [/.*\.(jpeg|jpg|gif|png|webp|svg)$/, 'Invalid image file format.'],
    },
    profit: {  // Added profit field
        type: Number,
        required: true,
    },
    subPhoto: {
        type: String,
        required: true,
    },
    last_total: {
        type: Number
    },
    counter_buy: {
        type: Number,
        default: 0,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
}); 

const Curtains = mongoose.model("Curtains", CurtainsSchema);

// Joi Validation Schema
const CurtainsJoiSchema = Joi.object({
    title: Joi.string().required(),  // التأكد من أنه حقل مطلوب
    desc: Joi.string().default(null),
    bef_price_per_meter: Joi.number().required(),  // تغيير النوع إلى Number في Joi
    aft_price_per_meter: Joi.number().required(),  // تغيير النوع إلى Number في Joi
    type: Joi.string().required(),
    percentage_tpye: Joi.string().required(),
    percentage: Joi.string().required(),
    pattern: Joi.string().optional(),
    warranty: Joi.string().optional(),
    recomment: Joi.string().max(250).optional(),
    exec_from: Joi.number().min(1).optional(),
    exec_to: Joi.number().optional(),
    category: Joi.string().required(),
    discount: Joi.number().optional(),
    offers: Joi.string().optional(),
    imgsUrl: Joi.array().items(
        Joi.string().regex(/.*\.(jpeg|jpg|gif|png|webp|svg)$/).optional().allow(null)  // السماح بـ null
    ).required(),
    profit: Joi.number().required(),
    subPhoto: Joi.string().required(),
    last_total: Joi.number(),
    createAt: Joi.date().default(Date.now).optional(),
});

// Example of how to use the Joi validation:
const validateCurtains = (curtainsData) => {
    return CurtainsJoiSchema.validate(curtainsData);
};

module.exports = Curtains;
module.exports.validateCurtains = validateCurtains;
