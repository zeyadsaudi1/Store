import { useContext, useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../4.style/page/signup.css';
import ArbianCountries from '../5.API/countries.json';
import { Auth } from '../context/context';
import UserName from '../1.components/makeuserName';

export default function SignUp() {
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('مصر');
    const [city, setCity] = useState('');
    const [province, setProvince] = useState('');
    const [postNum, setPostNum] = useState('');
    const [rpassword, setRPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [countries, setContries] = useState([]);
    const [message, setMessage] = useState('');
    const [show, setShow] = useState(false);
    const [press, setPress] = useState(false);
    const [show1, setShow1] = useState(false);
    const [press1, setPress1] = useState(false);
    const [next, setNext] = useState(false);
    const [loading,setLoading] = useState(false)

    const {
        setShowTermsAndConditions,
        API,
        lastName,
        setLastName,
        firstname,
        setFirstName,
        emailResginster,
        setEmailResgister,
        setGender,
        password,
        setPassword,
        phone,
        setPhone,
        gender,
        username,
        setUserName,
    } = useContext(Auth);

    useEffect(() => {
        setContries(ArbianCountries);
    }, []);

    const signNewUser = async (e) => {
        e.preventDefault();
        if (
            !firstname ||
            !lastName ||
            !username ||
            !emailResginster ||
            !password ||
            !rpassword ||
            !address ||
            !city ||
            !postNum ||
            !agree ||
            !phone
        ) {
            setMessage('يرجى إدخال جميع الحقول');
            return;
        }

        if (firstname.length < 3 || lastName.length < 3) {
            setMessage('يرجى إدخال عدد حروف للأسم أكبر من 3 أحرف');
            return;
        }

        if (phone.length < 10 || phone.length > 15) {
            setMessage('يرجى إدخال رقم الهاتف الصحيح');
            return;
        }

        if (!emailResginster.includes('@gmail.com')) {
            setMessage('يرجى إدخال عنوان البريد الإلكتروني الصحيح');
            return;
        }

        if (password.length < 8) {
            setMessage('كلمة المرور ضعيفة');
            return;
        }

        if (password !== rpassword) {
            setMessage('يرجى تأكيد كلمة المرور بشكل صحيح');
            return;
        }

        setMessage('');
        const data = {
            firstName: firstname,
            lastName: lastName,
            userName:username,
            email: emailResginster.toLowerCase().trim(),
            phone: phone,
            address: `${country}, ${province}, ${city}, ${postNum}, ${address}`,
            isMale: gender === "male" ? true : false,
            password: password,
        };

        try {
            const response = await fetch(`${API}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            });

            if (response.ok) {
                setNext(true)
                setLoading(false)
            } else if (response.status === 409) {
                setMessage('هذا البريد الإلكتروني أو رقم الهاتف مستخدم مسبقًا');
                setLoading(false)
            } else if (response.status === 408) {
                setMessage('اسم المستخدم مستخدم، يرجى اختيار اسم آخر');
                setLoading(false)
            } else {
                setMessage('حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى');
                setLoading(false)
            }
        } catch (error) {
            setMessage('حدث خطأ في الاتصال بالخادم');
            setLoading(false)
        }
    };
    return (
        <div className="sign">
            {!next ? 
            <div className="signBox">
            <h2>سجل في ويفي</h2>
            <p>انضم الينا في ويفي و حصل على خصم 25% على اول اوردر ليك</p>
                <div className="name">
                    <div className="fname">
                        <label>الأسم الأول</label>
                        <input onChange={(e) => setFirstName(e.target.value)} value={firstname} type="text" placeholder="ادخل الأسم الأول" maxLength="30" />
                    </div>
                    <div className="lname">
                        <label>الأسم الأخير</label>
                        <input onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" placeholder="ادخل الأسم الأخير" maxLength="30" />
                    </div>
                    <div className="lname">
                        <label>اسم المستخدم</label>
                        <input 
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[a-zA-Z]*$/.test(value)) {
                                    setUserName(value);
                                }
                            }} 
                            value={username} 
                            type="text" 
                            placeholder="ادخل الأسم المستخدم" 
                            maxLength="30" 
                        />
                    </div>
                </div>
                <div className="email-phone">
                    <div className="phone">
                        <label>رقم الهاتف</label>
                        <PhoneInput
                            country={'sa'}
                            value={phone}
                            onChange={(value) => setPhone(value)}
                            />
                    </div>
                    <div className="email">
                        <label>البريد الألكتروني</label>
                        <input onChange={(e) => setEmailResgister(e.target.value)} value={emailResginster} type="email" placeholder="ادخل البريد الإلكتروني" maxLength="100" />
                    </div>
                </div>
                <div className='address-and-dob'>
                    <div className='address'>
                        <label>الدولة</label>
                        <select onChange={(e) => setCountry(e.target.value)} value={country}>
                        {countries.map((e,i)=>
                            <option value={e.value} key={i}>{e.label}</option>
                        )}
                        </select>
                    </div>
                    <div className='address'>
                        <label>المحافظة</label>
                        <input onChange={(e) => setProvince(e.target.value)} value={province} type='text' placeholder='ادخل عنوان المنزل' />
                    </div>
                    <div className='address'>
                        <label>المدينة</label>
                        <input onChange={(e) => setCity(e.target.value)} value={city} type='text' placeholder='ادخل عنوان المنزل' />
                    </div>
                </div>
                <div className='add'>
                    <div className='address'>
                        <label>عنوان المنزل</label>
                        <input onChange={(e) => setAddress(e.target.value)} value={address} type='text' placeholder='ادخل عنوان المنزل' />
                    </div>
                    <div className='address'>
                        <label>رقم البريدي</label>
                        <input 
                            onChange={(e) => {
                                const value = e.target.value;
                                // السماح فقط بالأرقام
                                if (/^\d*$/.test(value)) {
                                    setPostNum(value);
                                }
                            }}
                            value={postNum}
                            type='text' 
                            placeholder='ادخل الرقم البريدي'
                            inputMode='numeric'
                        />
                    </div>
                </div>
                <div className='gender'>
                    <input onChange={(e) => setGender(e.target.value)} type='radio' value='male' name='gender' />
                    <label>ذكر</label>
                    <input onChange={(e) => setGender(e.target.value)} type='radio' value='female' name='gender' />
                    <label>أنثى</label>
                </div>
                <div className='password'>
                    <div className='pass'>
                        <label>ادخل كلمة المرور</label>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type={show ? 'text': "password"} placeholder='ادخل كلمة المرور'/>
                        <button
                            onMouseDown={() => {setShow(true);setPress(true)}}
                            onMouseUp={() => {setShow(false);setPress(false)}}
                            onMouseLeave={() => { if (press) setShow(false); }}
                            >
                            {show ? 
                                <i className="fa-regular fa-eye"></i>
                                : 
                                <i className="fa-regular fa-eye-slash"></i>
                            }
                        </button>
                    </div>
                    <div className='rpass'>
                        <label>تأكيد كلمة المرور</label>
                        <input onChange={(e) => setRPassword(e.target.value)} value={rpassword} type={show1 ? 'text': "password"} placeholder='تأكيد كلمة المرور'/>
                        <button className='rpassBtn'
                            onMouseDown={() => {setShow1(true);setPress1(true)}}
                            onMouseUp={() => {setShow1(false);setPress1(false)}}
                            onMouseLeave={() => { if (press1) setShow1(false); }}
                            >
                            {show1 ? 
                                <i className="fa-regular fa-eye"></i>
                                : 
                                <i className="fa-regular fa-eye-slash"></i>
                            }
                        </button>
                    </div>
                </div>
                <p className='error'>{message}</p>
                <div className='checked'>
                    <input onChange={(e) => setAgree(e.target.checked)} type='checkbox' value='true' />
                    <label> أوافق على الشروط والأحكام</label>
                </div>
                <div className='rolesBtn'>يرجى قراءة هذه <button onClick={()=>setShowTermsAndConditions(true)}>الشروط بعناية</button>. إذا كنت لا توافق على أي جزء منها، يُرجى الامتناع عن استخدام النظام.</div>
                <button disabled={loading} onClick={signNewUser}>
                تسجيل الأن
                {loading ? 
                <i className="fa fa-spinner fa-spin"></i>
                :
                null
                }
                </button>
            </div>
            :
            <UserName/>
            }
        </div>
    );
}
