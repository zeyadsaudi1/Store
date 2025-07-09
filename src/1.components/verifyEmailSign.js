import { useContext, useEffect, useState } from "react";
import OtpInput from 'react-otp-input';
import '../4.style/components/verify_email_sign.css';
import { Auth } from "../context/context";

export default function VerifyEmail() {
    const {
        API,
        firstname,
        lastName,
        emailResginster,
        phone,
        fullAdress,
        gender,
        username,
        password,
        urluser,
    } = useContext(Auth);

    const [OTP, setOTP] = useState('');
    const [welcome, setWelcome] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API}/verifyEmail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                mail: emailResginster
            })
        });
    }, [API, emailResginster]);

    const VerifyRegisterEmail = async () => {
        setLoading(true);
        if (OTP.length === 6) {
            

            // await fetch(`${API}/verified-and-finished`, {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(data),
            // })
            // .then((res) => {
            //     if (res.status === 201) {
            //         setWelcome(true);
            //         setInterval(() => {
            //             window.location.pathname = '/';
            //         }, 3000);
            //         setLoading(false);
            //     } else if (res.status === 404) {
            //         setMessage('رمز التحقق خطأ يرجى تصفح البريد الإلكتروني');
            //         setLoading(false);
            //     } else if (res.status === 400 || res.status === 500) {
            //         window.location.reload();
            //     } else if (res.status === 409) {
            //         setLoading(false);
            //         setMessage('حدث خطأ أثناء التسجيل يرجى إعادة المحاولة مرة أخرى');
            //     }
            // });
        }
    };

    return (
        <div className='signBox verifyMail'>
            {welcome ? (
                <div className="done">
                    <img width='100' src={require('../3.public/gifs/darkscuccss.gif')} alt="checked"></img>
                    <h2>تم التحقق اهلا بك في ويفي</h2>
                    <p>تم التسجيل بنجاح</p>
                </div>
            ) : (
                <div>
                    <h3><i className="fa-solid fa-envelope"></i></h3>
                    <h2>لقد أرسلنا إليك رسالة لتأكيد البريد الإلكتروني <span className="email">{emailResginster.trim().toLowerCase()}</span></h2>
                    <p>تصفح البريد الإلكتروني الذي اخترته</p>
                    <label><i className="fa-solid fa-asterisk"></i> دخل رمز تحقق لمرة واحدة</label>
                    <div className="otp">
                        <OtpInput
                            value={OTP}
                            onChange={setOTP}
                            numInputs={6}
                            renderSeparator={<span className='space'></span>}
                            renderInput={(props) => <input {...props} inputMode="numeric" />}
                        />
                    </div>
                    <p className="error">{message}</p>
                    <button disabled={loading} onClick={VerifyRegisterEmail} className="checkNow" style={OTP.length === 6 ? { backgroundColor: "green", color: "#fff" } : null}>
                        تحقق 
                        {loading ? 
                            <i className="fa fa-spinner fa-spin"></i>
                            :
                            <i className="fa-regular fa-circle-check"></i>
                        }
                    </button>
                </div>
            )}
        </div>
    );
}
