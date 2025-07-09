import { useContext, useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import '../4.style/components/verifyCode.css'
import { Auth } from '../context/context';

export default function VerifyCodePage() {
    const { email,API,checked,mode } = useContext(Auth)
    const [mes,setmes] = useState('');
    const [OTP, setOTP] = useState('');
    const [verifed,setVerifed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    let mail = ''
    for(let i = 0; i < email.length;i++ ) {
        if(email[i] === '@') {
            break;
        }
        else {
            mail += email[i]
        }
    }

    useEffect(()=>{
        if(checked) {
            fetch(`${API}/sendVerifyCode`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({email: email})
            }).then((res) => {
                if(res.status === 500) {
                    setmes('هناك عطل في السيرفر يرجى اعادة المحاولة لاحقا')
                }
            })
        }
    },[API,checked,email])

    const verifyCode = async () => {
        setIsLoading(true)
        const checkNum = Number(OTP)
        if(OTP.length === 6 && !isNaN(checkNum)) {
            await fetch(`${API}/verifyCodeNow`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({ otp: OTP, email: email})
            }).then((res) => {
                if(res.ok) {
                    setVerifed(true)
                    setInterval(() => {
                        window.location.reload();
                    }, 3000);
                    setIsLoading(false)
                } 
                else if(res.status === 404) {
                    setmes("رقم التحقق ليس صحيحا تصفح البريد الألكتروني")
                    setIsLoading(false)
                }
            })
        }
    }

    return (
        <div className="verify">
            {!verifed? 
            <div>
                <h4>تم إرسال رسالة التحقق <i className="fa-solid fa-envelope"></i></h4>
                <p className='mail'>{"**************"+mail.slice(-4)+'@gmail.com'}</p>
                <OtpInput
                    value={OTP}
                    onChange={setOTP}
                    numInputs={6}
                    renderSeparator={<span className='space'></span>}
                    renderInput={(props) => <input {...props} inputMode="numeric"/>}
                />
                <p className='error errorSerververify'>{mes}</p>
                <button
                disabled={isLoading}
                onClick={verifyCode}>
                    {isLoading ? <i className="fa fa-spinner fa-spin"></i> :
                    <i className="fa-solid fa-key"></i>
                    }
                    تحقق
                </button>
            </div>
            :
            <div className='verifed-success'>
                {mode === 'dark' ? 
                <img src={require('../3.public/gifs/darkscuccss.gif')} alt='verifyDark'></img>
                :
                <img src={require('../3.public/gifs/success.gif')} alt='verfiyLight'></img>
                }
            </div>
            }
        </div>
    );
}
