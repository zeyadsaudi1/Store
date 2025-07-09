require('dotenv').config();


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodeMailer = require('nodemailer');
const cookieParser = require('cookie-parser')
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

const { modelUser, ValidUser } = require('./model/userSchema');
const { quick, quickValud } = require('./model/quickUser');
const exp = require('constants');
const { validateCurtains } = require('./model/curtainsSchema');
const Curtains = require('./model/curtainsSchema');
const ADS = require('./model/adsSchema');
const ORDER = require('./model/orderSchema');
// const { default: UserName } = require('../app/src/1.components/makeuserName');
const cloudinary = require('cloudinary').v2;
const paypal = require("./paypal_service/paypal")


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const PORT = process.env.PORT;

mongoose.connect(process.env.DB)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));
const app = express();

const Transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.TRANSPORTER,
        pass: process.env.SECRET_TRANS,
    },
});
// https://wavy-v2.vercel.app
// origin: ["http://localhost:3000", "https://wavy-v2.vercel.app"],
// origin:"http://localhost:3000",
app.use(cors({
    origin:"https://wavy-v2.vercel.app",
    credentials: true,
    methods: ['POST','GET'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const adsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/ads'); // مجلد الإعلانات
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.fieldname + path.extname(file.originalname));
    }
});

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgProduct'); // مجلد الصور للمنتجات
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.fieldname + path.extname(file.originalname));
    }
});


const storage = multer.diskStorage({
    destination: (req,res,cb) => {
        cb(null,'public/userImgs')
    },
    filename: (req,file,cb) => {
        cb(null, Date.now() + "_" + file.fieldname + path.extname(file.originalname));
    }
})

// upload user img
//const upload = multer({
  //  storage: storage,
//})

// upload product img
const uploadProductImage = multer({ storage: productStorage });


// upload ADS
// const uploadAds = multer({
//     storage: adsStroage,
// })

const storage2 = multer.memoryStorage();

const uploadAds = multer({
    storage: adsStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('نوع الملف غير مدعوم'), false);
        }
        cb(null, true);
    },
});

app.use(express.static('public'));

app.get('/', (req,res) => {
    res.send("i'm runnig..");
})

// app.post('/checkLogin', async (req, res) => {
//     const { emailUser, password } = req.body;

//     if (!emailUser || !password) {
//         return res.status(400).send({ message: "Email or password is empty" });
//     }

//     try {
//         // التحقق من المستخدم بناءً على البريد الإلكتروني
//         const isUser = await modelUser.findOne({ email: emailUser });

//         if (!isUser) {
//             return res.status(404).send({ message: 'User is not found!' });
//         }

//         // التحقق من كلمة المرور
//         const isPasswordValid = await bcrypt.compare(password, isUser.password);
//         if (!isPasswordValid) {
//             return res.status(401).send({ message: 'Invalid email or password!' });
//         }

//         // تحديث حالة تسجيل الدخول
//         await modelUser.findOneAndUpdate(
//             { email: emailUser },
//             { logged: true },
//             { new: true }
//         );

//         // تحضير البيانات لعملية تسجيل الدخول
//         const Payload = {
//             fullName: `${isUser.firstName} ${isUser.lastName}`,
//             role: isUser.role,
//             address: isUser.address,
//             phone: isUser.phone,
//             img: isUser.profileImg,
//             username: isUser.userName,
//             isactive: true,
//         };

//         // إنشاء التوكن JWT
//         const Token = await JWT.sign(Payload, process.env.SECRET_KEY, { expiresIn: '12h' });

//         res.cookie('token', Token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'None',
//             path: '/',
//             maxAge: 24 * 60 * 60 * 1000,
//         });

//         return res.status(200).send({ message: "You are logged in!" });

//     } catch (error) {
//         console.error("Error during login:", error);
//         return res.status(500).send({ message: "Server error, please try again later." });
//     }
// });


app.post("/quickregister", async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).send({ message: "Phone or password is empty" });
    }

    try {
        const existingUser = await quick.findOne({ phone });

        let token;

        if (existingUser) {
            // إذا كان المستخدم موجودًا، تحقق من كلمة المرور
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordValid) {
                return res.status(401).send({ message: "Invalid password" });
            }
            existingUser.logged = true,
            existingUser.save()
            // أنشئ التوكن إذا كانت كلمة المرور صحيحة
            token = JWT.sign({ phone: phone, active: true, role: existingUser.role }, process.env.SECRET_KEY, { expiresIn: "12h" });
        } else {
            // قم بتشفير كلمة المرور
            const hashedPassword = await bcrypt.hash(password, 10);

            const newuser = new quick({
                phone: phone,
                password: hashedPassword, // استخدم كلمة المرور المشفرة
                logged: true,
            });

            await newuser.save();

            token = JWT.sign({ phone: phone, active: true, role: "user" }, process.env.SECRET_KEY, { expiresIn: "12h" });
        }

        // قم بتخزين التوكن في الكوكيز
        res.cookie('token2', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000, // مدة صلاحية الكوكيز يوم واحد
        });

        res.status(201).send({ message: "Token created successfully!" });
    } catch (error) {
        console.error("Error during registration:", error);

        // Handle errors, such as duplicate entries or database issues
        res.status(500).send({ message: "An error occurred during registration" });
    }
});


function valid(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).send({ message: 'Token is missing' });
    }
    
    JWT.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {
            return res.status(400).send({ message: 'Token expired or invalid' });
        }
        req.user = data;
        next();
    });
}
// app.get("/isLogged", valid, (req,res) => {
//     const user = req.user
//     res.status(200).json({
//         data: user
//     })
// })


function valid2(req, res, next) {
    const token = req.cookies.token2;
    if (!token) {
        return res.status(400).send({ message: 'Token is missing' });
    }
    
    JWT.verify(token, process.env.SECRET_KEY, async (err, data) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                try {
                    await quick.updateOne({ phone: data.phone }, { $set: { logged: false } });
                    return res.status(400).send({ message: 'Token expired, logged status set to false' });
                } catch (dbErr) {
                    return res.status(500).send({ message: 'Database error', error: dbErr.message });
                }
            }
            return res.status(400).send({ message: 'Token invalid' });
        }
        req.user = data;
        next();
    });
}

app.get("/isLogged2", valid2, (req,res) => {
    const user = req.user
    res.status(200).json({
        data: user
    })
})

app.post('/logout', valid2, async (req, res) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        const updateLogin = await quick.findOneAndUpdate(
            { phone: user.phone },
            { logged: false }, 
            { new: true }
        );

        if (!updateLogin) {
            return res.status(500).send({ message: "Failed to log out. User update failed." });
        }
        res.clearCookie("token2", {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        return res.status(200).send({ message: "Logout successful!" });
    } catch (err) {
        console.error("Error during logout:", err);
        return res.status(500).send({ message: "An error occurred during logout." });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { data } = req.body;
        const checkFromEmail = await modelUser.findOne({email: data.mail});
        const checkFromPhone = await modelUser.findOne({phone: data.phone});
        const repeatedUserName = await modelUser.findOne({userName: data.userName});
        if (checkFromEmail || checkFromPhone) {
            return res.status(409).send({message: "رقم الهاتف / البريد الإلكتروني مسجل مسبقًا"});
        }
        if (repeatedUserName) {
            return res.status(408).send({message: "هذا الاسم مستخدم، اختر اسمًا آخر"});
        }

        const { error } = ValidUser(data);
        if (error) {
            console.log(error);
            return res.status(401).send({message: "بيانات المستخدم غير صحيحة"});
        }

        const saltRounds = 10;
        const encPass = await bcrypt.hash(data.password, saltRounds);

        const newUser = new modelUser({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            gender: data.isMale,
            password:encPass,
            userName: data.userName
        });

        await newUser.save();
        return res.status(201).send({message: "تم تسجيل المستخدم بنجاح"});
    } catch (err) {
        console.error("Error registering user:", err);
        return res.status(500).send({message: "حدث خطأ أثناء التسجيل"});
    }
});


app.post('/put-photo-for-register', async (req,res) => {
    const {userN,urlImg } = req.body;
    if(!userN) return res.status(400).send({message: "user is empty"});
    try {
        const getUsername = await modelUser.findOneAndUpdate({userName: userN}, {profileImg: urlImg}, {new: true});
        if(!getUsername) {
            return res.status(404).send({message: "user not found"});
        }
        res.status(200).send({message: "update img successfull!"});
    }catch(error) {
        res.status(500).send({message: "internal server error"});
    }
})

app.post("/verifyEmail", async (req, res) => {
    const { mail } = req.body;

    if (!mail) return res.status(400).send({ message: "Bad request! Email is required." });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
        return res.status(400).send({ message: "Invalid email format." });
    }
    verifyCodeRegister = Math.floor(100000 + Math.random() * 900000);
    try {
        await Transporter.sendMail({
            from: `"Wavy - ويفي"`,
            to: mail,
            subject: `wavy - ويفي verify code - انضام الينا`,
            html: `
            <h1>ويفي - Wavy</h1>

            <h3>شكرًا لانضمامك إلينا في Wavy! نحن سعداء بوجودك معنا ونتطلع إلى تقديم أفضل تجربة لك.</h3>
            
            <h2>لتأكيد بريدك الإلكتروني واستكمال عملية التسجيل، يرجى إدخال رمز التحقق الخاص بك في الحقل المخصص.</h2>
            
            <h4>رمز التحقق الخاص بك هو:</h4>
            
            <p>رمز التحقق: <strong>${verifyCodeRegister}</strong></p>
            
            <h3 style="color: red;">يرجى ملاحظة أنه إذا لم تطلب هذا الرمز، يمكنك تجاهل هذه الرسالة.</h3>
            
            <p>في حال واجهت أي مشكلة أو كانت لديك أي استفسارات، لا تتردد في التواصل معنا عبر البريد الإلكتروني: wavysupport@gmail.com. نحن هنا دائمًا لمساعدتك.</p>
            
            <p>شكرًا لك على ثقتك في ويفي.</p>
            
            <p>مع أطيب التحيات،</p>
            <p>فريق الدعم الفني</p>
            ويفي - Wavy  
            wavysupport@gmail.com
            `
        });
        res.status(200).send({ message: "Verification code sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send({ message: "Failed to send verification code. Please try again later." });
    }
});

app.use((req, res, next) => {
    res.setTimeout(300000, () => {
        console.log('تم انتهاء المهلة للطلب.');
        res.status(408).send({ message: 'تم انتهاء المهلة' });
    });
    next();
});

app.post('/verified-and-finished', async (req, res) => {
    const {
        otpCode,
        firstname,
        lastName,
        emailResginster,
        phone,
        fullAdress,
        gender,
        username,
        password,
        profileImg,
    } = req.body;

    if (!otpCode || !firstname || !lastName || !emailResginster || !phone || !fullAdress || !gender || !username || !password) {
        return res.status(400).send({ message: "All fields are required!" });
    }

    // التحقق من صحة الكود
    if (+otpCode !== verifyCodeRegister) {
        return res.status(404).send({ message: "Verification code is incorrect!" });
    }

    verifyCodeRegister = null;

    try {
        // تشفير كلمة المرور

        // تجهيز بيانات المستخدم
        const NewUser = {
            firstName: firstname,
            lastName: lastName,
            email: emailResginster,
            phone: phone,
            address: fullAdress,
            isMale: gender === 'male' ? true : false,
            userName: username,
            password: encPass,
            profileImg: profileImg || null,
        };

        const { error } = ValidUser(NewUser);
        if (error) {
            console.log(error)
            return res.status(409).send({ message: "Invalid user data!" });
        }

        // حفظ المستخدم في قاعدة البيانات
        const SaveUser = new modelUser(NewUser);
        await SaveUser.save();

        res.status(201).send({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error occurred while registering user." });
    }
});


app.get('/premission', valid2, (req, res) => {
    const token = req.cookies.token2;
    if (!token) {
        return res.status(401).json({ message: "لا يوجد توكن." });
    }
    JWT.verify(token, process.env.SECRET_KEY, (err, result) => {
      if (err) {
        return res.status(403).json({ message: "الجلسة منتهية." });
      }
    const isAdmin = result.role === 'admin';
    res.status(200).json({ Auth: isAdmin });
    });
  });
  

// app.get('/get-users', valid, async (req,res) => {
//     const _GETDATA_ = await modelUser.find().select('-password');;
//     if(_GETDATA_ === null) return res.status(404).send({message: "not found any users"});
//     res.status(200).json({data: _GETDATA_})
// })
app.get('/get-users', valid2, async (req,res) => {
    const _GETDATA_ = await quick.find().select('-password');;
    if(_GETDATA_ === null) return res.status(404).send({message: "not found any users"});
    res.status(200).json({data: _GETDATA_})
})

app.post('/upload-product', async (req, res) => {
    let discountValue = 0;
    let last_total = 0;
    const discount = req.body.disc;

    // حساب الخصم
    if (discount[discount.length - 1] === '%') {
        discountValue = discount.slice(0, discount.length - 1) / 100;
        last_total = req.body.aftPrice - (discountValue * req.body.aftPrice);
    } else {
        discountValue = +discount;
        last_total = req.body.aftPrice - discountValue;
    }

    // إنشاء بيانات المنتج الجديد
    const newProduct = {
        title: req.body.productName,
        desc: req.body.desc,
        bef_price_per_meter: +req.body.befPrice,
        aft_price_per_meter: +req.body.aftPrice,
        type: req.body.type,
        percentage_tpye: req.body.percentageType,
        percentage: req.body.percentage,
        pattern: req.body.pattern,
        warranty: req.body.warranty,
        recomment: req.body.recomment,
        exec_from: req.body.exacFrom,
        exec_to: req.body.exacTo,
        category: req.body.category,
        last_total: last_total,
        discount: discountValue,
        offers: req.body.offer,
        imgsUrl: [
            req.body.imgProduct, 
            req.body.imgProduct1, 
            req.body.imgProduct2, 
            req.body.imgProduct3, 
            req.body.imgProduct4
        ], // روابط الصور المستلمة من React
        subPhoto: req.body.subPhotoUrl,
        profit: req.body.aftPrice - req.body.befPrice,
    };

    const { error } = validateCurtains(newProduct);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const addNewProduct = new Curtains(newProduct);
        const savedProduct = await addNewProduct.save();
        res.status(201).send({ message: 'Product uploaded successfully', product: savedProduct });
    } catch (err) {
        console.error('Error saving product:', err);
        res.status(500).send('Internal server error');
    }
});

app.post('/updatee', async (req, res) => {
    const {
        id, title, befPrice, aftPrice, type, percType, percent, pattern, warranty, recomment, exacFrom, category, exacTo, disc, offer, desc
    } = req.body;

    let discountValue = 0;
    let last_total = 0;

    // حساب قيمة الخصم
    if (disc[disc.length - 1] === '%') {
        discountValue = disc.slice(0, disc.length - 1) / 100;
        last_total = aftPrice - (discountValue * aftPrice);
    } else {
        discountValue = +disc;
        last_total = aftPrice - discountValue;
    }

    try {
        const getEditCurtain = await Curtains.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    title: title,
                    bef_price_per_meter: befPrice,
                    aft_price_per_meter: aftPrice,
                    type: type,
                    percentage_tpye: percType,
                    percentage: percent,
                    pattern: pattern,
                    warranty: warranty,
                    recomment: recomment,
                    exec_from: exacFrom,
                    exec_to: exacTo,
                    discount: discountValue,
                    desc: desc,
                    offers: offer,
                    profit: aftPrice - befPrice,
                    last_total: last_total,
                }
            },
            { new: true } // للحصول على السجل المحدث
        );

        if (!getEditCurtain) {
            console.log(getEditCurtain)
            return res.status(404).json({ message: 'Curtain not found' });
        }

        res.status(200).json({ message: 'Data updated successfully', data: getEditCurtain });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating data', error: err.message });
    }
});


app.get('/get-curtains', async (req,res) => {
    const GET_curtains = await Curtains.find().select('-createAt -profit');
    if(!GET_curtains) return res.status(404).send({message: "not curtains found"});
    res.status(200).json({data:GET_curtains})
})

app.post('/send-ad', async (req, res) => {
    try {
        const { url, title, ads } = req.body;

        if (!ads || !url) {
            return res.status(400).json({ error: "يرجى إدخال جميع البيانات المطلوبة" });
        }

        const ad = {
            img: ads,
            title: title || "",
            url: url,
        };

        const add_AD = new ADS(ad);
        await add_AD.save();

        res.status(201).json({ message: "تم إضافة الإعلان بنجاح", ad });
    } catch (error) {
        console.error("خطأ أثناء إضافة الإعلان:", error);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة الإعلان" });
    }
});


app.get("/getads", async(req,res) => {
    const getAds = await ADS.find({});
    if(!getAds) return res.status(404).send({message: "not found"});
    res.status(200).json({data: getAds});
})

app.post('/add-cart', valid2, async (req, res) => {
    try {
        const user = req.user;
        const { nameProduct, img, needs, total_aft, total_bef, num } = req.body;

        if (!nameProduct || !img || !needs || !total_aft || !total_bef) {
            return res.status(400).json({ message: "جميع الحقول مطلوبة" });
        }

        const userRecord = await quick.findOne({ phone: user.phone });
        if (!userRecord) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        userRecord.cart.item = userRecord.cart.item || []; 
        userRecord.cart.item.push({
            id: uuidv4(),
            nameProduct,
            img,
            needs,
            total_aft,
            total_bef,
            num,
        });

        await userRecord.save();

        // إرسال استجابة نجاح
        res.status(200).json({ message: "تمت إضافة المنتج إلى السلة بنجاح", cart: userRecord.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "حدث خطأ أثناء إضافة المنتج إلى السلة" });
    }
});


app.get('/get-cart', valid2, async (req, res) => {
    try {
        const user = req.user; // التحقق من المستخدم المستخرج من التوكين
        if (!user) return res.status(404).send({ message: "User not found!" });

        const getPerson = await quick.findOne({ phone: user.phone });
        if (!getPerson) return res.status(404).send({ message: "User data not found in database!" });

        res.status(200).json({ data: getPerson.cart.item });
    } catch (error) {
        console.error("Error in /get-cart route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

app.post('/delete-cart-item/:id', valid2, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;

        // التأكد من وجود المستخدم في قاعدة البيانات
        const userRecord = await quick.findOne({ phone: user.phone });
        if (!userRecord) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }

        // التحقق من وجود العنصر في السلة قبل الحذف
        const itemIndex = userRecord.cart.item.findIndex(item => item.id === id);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "العنصر غير موجود في السلة" });
        }

        userRecord.cart.item.splice(itemIndex, 1);

        if (userRecord.cart.item.length === 0) {
            userRecord.cart.item = [];
        }
        await quick.updateOne(
            { phone: user.phone },
            { $set: { cart: userRecord.cart } }
        );

        // إرسال استجابة النجاح
        res.status(200).json({ message: "تم حذف العنصر بنجاح", cart: userRecord.cart });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).json({ message: "حدث خطأ أثناء حذف العنصر" });
    }
});


app.post('/new-order', valid2, async (req, res) => {
    try {
        const user = req.user; // بيانات المستخدم المصادق عليه
        const { number_products, order_details, totalPriceProduct, payment_method,addresss,name } = req.body;
        let status_payment = false;
        const newOrder = new ORDER({
            customer_name: name,
            customer_address: addresss,
            customer_phone: user.phone,
            payment_method: payment_method,
            status_payment: payment_method === 'visa' ? true : false,
            number_order: number_products,
            order_details: order_details.map((item) => ({
                id_curtain_in_order: item.id,
                img_curtain: item.img,
                title_curtains: item.nameProduct,
                price_curtains: item.total_aft,
                number: item.num,
                Chain: item.needs.chainType === 75 ? "بلاستيك شديد التحمل" : "معدني",
                height: item.needs.height,
                width: item.needs.width,
                editWidth: item.needs.widthAdjustment,
                editHeight: item.needs.heightAdjustment,
            })),
            total_order: totalPriceProduct,
        });

        await newOrder.save();

        await quick.findOneAndUpdate(
            { phone: user.phone },
            { $set: { "cart.item": [] } },
            { new: true }
        );

        res.status(201).send({ message: "Order saved successfully and cart cleared!" });
    } catch (error) {
        console.error("Error processing order:", error.message);
        res.status(500).send({ error: "Failed to process the order." });
    }
});

app.get("/getAll-orders", valid2, async (req, res) => {
    try {
        const GETORDER = await ORDER.find();
        if (GETORDER.length === 0) {
            return res.status(404).send({message: "No orders found"});
        }
        res.status(200).json({orders: GETORDER});
    } catch (error) {
        res.status(500).send({message: "Server error", error: error.message});
    }
});

app.post('/done-payment', valid2, async (req,res) => {
    const {id} = req.body;
    if(!id) return res.status(404).send({message: "not found id"});
    try {
        const getOrder = await ORDER.findByIdAndUpdate(id,{ status_payment: true },{ new: true });
        res.status(200).send({message: "done!"})
    }
    catch(err) {
        console.error(err);
        res.status(500).send({message: "internal server error"})
    }
})

app.post('/done-order', valid2, async (req,res) => {
    const {id} = req.body;
    if(!id) return res.status(404).send({message: "not found id"});
    try {
        const getOrder = await ORDER.findByIdAndUpdate(id,{ Receipt_status: true },{ new: true });
        res.status(200).send({message: "done!"})
    }
    catch(err) {
        console.error(err);
        res.status(500).send({message: "internal server error"})
    }
})

app.post('/payment-checkout', async (req, res) => {
    const items = req.body.items;

    if (!items || !Array.isArray(items)) {
        return res.status(400).send({ error: "Invalid items format. Expected an array." });
    }

    try {
        const url = await paypal.createOrder(items);

        // إرسال الرد مع الرابط
        res.status(200).send({ url: url });
    } catch (error) {
        // إرسال رسالة خطأ مفصلة
        console.error("Error during payment checkout:", error);
        res.status(500).send({ error: "Error processing the payment" });
    }
});


app.get('/complete-order', async (req, res) => {
    try {
        const paymentResult = await paypal.capturePayment(req.query.token);

        res.status(200).json({
            success: true,
            message: "تم الدفع بنجاح",
            details: paymentResult 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "حدث خطأ أثناء معالجة الدفع",
            error: error.message
        });
    }
});

app.get('/cancel-order', (req, res) => {
    res.status(200).send()
})

app.post('/del-product', async (req,res)=>{
    const {id} = req.body;
    const isdelete = await Curtains.findByIdAndDelete(id);
    if(isdelete) {
        res.status(200).send()
    }else {
        res.status(404).send()
    }
})


app.listen(PORT, ()=>{
    console.log(`the server was running...`);
})