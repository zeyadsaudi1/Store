const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    customer_address: {
        type: String,
        required: true,
    },
    customer_phone: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        default: "cash",
        enum: ["cash", "visa"],
    },
    status_payment: {
        type: Boolean,
        default: false,
    },
    Receipt_status: {
        type: Boolean,
        default: false,
    },
    number_order: {
        type: String,
        required: true
    },
    order_details: [
        {
            id_curtain_in_order: {type: String},
            title_curtains: {type: String, required: true},
            img_curtain: {type: String, required: true}, 
            price_curtains: {type: String, required: true}, 
            number: {type: Number, required: true}, 
            Chain: {type: String, required: true}, 
            width: {type: Number, required: true}, 
            height: {type: Number, required: true}, 
            editWidth: {type: Number}, 
            editHeight: {type: Number},
        }
    ],
    total_order: {
        type: Number,
        required: true,
    }
})

const ORDER = mongoose.model("order", OrderSchema);

module.exports = ORDER;
