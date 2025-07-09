const axios = require('axios');

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    });

    return response.data.access_token;
}

exports.createOrder = async (items) => {
    const accessToken = await generateAccessToken();

    // تحويل unit_amount إلى رقم وحساب الإجمالي
    const total = items.reduce((acc, item) => {
        const unitAmount = parseFloat(item.unit_amount); // تحويل إلى رقم
        return acc + (item.quantity * unitAmount);
    }, 0).toFixed(2);

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: items.map(item => ({
                        name: item.name,
                        description: '',
                        quantity: item.quantity,
                        unit_amount: {
                            currency_code: 'USD',
                            value: parseFloat(item.unit_amount).toFixed(2) // تحويل إلى رقم مع تثبيت القيمتين العشريتين
                        }
                    })),
                    amount: {
                        currency_code: 'USD',
                        value: total,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: total
                            }
                        }
                    }
                }
            ],
            application_context: {
                return_url: process.env.BASE_URL + '/complete-order',
                cancel_url: process.env.BASE_URL + '/cancel-order',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'app_curtains'
            }
        })
    });

    // التأكد من وجود رابط الموافقة
    const approvalLink = response.data.links.find(link => link.rel === 'approve');
    if (!approvalLink) {
        throw new Error('Approval link not found in PayPal response');
    }

    return approvalLink.href;
};

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    return response.data;
};
