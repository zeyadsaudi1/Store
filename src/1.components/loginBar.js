import { useContext, useState } from "react"
import { Auth } from "../context/context"
import Logo from "./logo"
import '../4.style/components/login.css'
import PhoneInput from 'react-phone-input-2';

export default function LoginBar() {
    const { 
        mode,
        setLoginBar, 
        API,
        // email,
        // setEmail,
    } = useContext(Auth);

    const [password,setPassword] = useState('')
    const [clicked,setClicked] = useState(false)
    const [loading,setLoading] = useState(false)
    
    const [message,setMessage] = useState('')

    const [show,setShow] = useState(false)
    const [phone,setPhone] = useState("")
    const [verifed,setVerifed] = useState(false)

    const HandleLogin = (e)=>{
        e.preventDefault();
        setClicked(true)
        // if(email.trim().toLowerCase().includes("@gmail.com") && password !== '') {
        //     fetch(`${API}/checkLogin`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type":"application/json",
        //         },
        //         credentials: "include",
        //         body: JSON.stringify({
        //             emailUser: email.trim().toLowerCase(),
        //             password: password,
        //         })
        //     }).then((res) => {
        //         if(res.ok) {
        //             setVerifed(true)
        //             setLoading(false)
        //             setInterval(() => {
        //                 window.location.reload();
        //             }, 3000);
        //         }
        //         else if(res.status === 404 || res.status === 401) {
        //             setMessage('هناك خطأ في البريد الألكتروني او كلمة المرور')
        //             setLoading(false)
        //         }
        //     }).catch(err=> {
        //             setLoading(false)
        //             console.log('error')}
        //         )
        //     setClicked(false)
        // }
        if(phone !== "" && phone.length < 16 && password !== '') {
            setLoading(true)
            fetch(`${API}/quickregister`, {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    phone: phone, 
                    password: password
                })
            }).then((res)=> {
                if(res.ok){
                    window.location.reload()
                }else if(res.status === 401) {
                    setMessage("رقم الهاتف/كلمة المرور غير صحيحة")
                    setLoading(false)
                }
            }).catch(()=>{
                setMessage("ادخل رقم الهاتف الصحيح")
                setLoading(false)
            })
        }
    }
    return (
        <div className="loginBar">
            <div className="login">
            {!verifed? 
                <>
                <button onClick={()=> {
                    setLoginBar(false)
                    setPhone('')
                    setPassword('')
                }} className="close">X</button>
                <div className="logo">
                    <Logo />
                <h2>سجل دخولك الأن</h2>
                </div>
                <div className="formBox">
                <label>ادخل رقم الهاتف</label>
                    <PhoneInput
                            country={'sa'}
                            value={phone}
                            onChange={(value) => setPhone(value)}
                            />
                    <label>ادخل كلمة المرور</label>
                    <div className="pass">
                        <input onChange={(e)=> setPassword(e.target.value)} value={password} type={show ? 'text': "password"} placeholder="ادخل كلمة السر الخاصة بك" />
                        {!show ? 
                                <button className="show" onClick={() => {
                                    setShow(true);
                                }}><i className="fa-solid fa-eye"></i> </button> 
                                : 
                                <button className="show" onClick={() => {
                                    setShow(false);
                                }}><i className="fa-solid fa-eye-slash"></i> </button> 
                        }
                    </div>
                    {password === '' && clicked && <p className="error">يرجى ادخال كلمة المرور</p>}
                    <p className={"error"}>{message}</p>
                    <button
                    disabled={loading}
                    onClick={HandleLogin} className="loginBtn" type="submit">
                        {loading ? <i className="fa fa-spinner fa-spin"></i> : null}
                        تسجيل الدخول
                    </button>
                    {/* <Link onClick={() => setLoginBar(false)} to='/signup'>اشتراك الأن</Link> */}
                </div>
                </>
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
        </div>
    )
}