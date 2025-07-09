import { useContext, useEffect, useState } from 'react';
import '../4.style/components/make_username.css'
import { Auth } from '../context/context';

export default function UserName() {
    const {firstname, lastName, API, username, gender, mode} = useContext(Auth);
    const [urluser, setUrluser] = useState("");
    const [userImage,setUserImage] = useState("");
    const [message,setMessage] = useState("");
    const [loading,setLoading] = useState(false)
    const [success,setSucess] = useState(false)
    
    const FinishSign = (e) => {
            fetch(`${API}/put-photo-for-register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    userN: username,
                    urlImg: urluser,
                })
            }).then((res) => {
                if (res.ok) {
                    setSucess(true);
                    setTimeout(() => {
                        window.location.pathname = '/'
                    }, 3000);
                } else if (res.status === 409) {
                    setMessage("هذا الأسم مستخدم بسبقا يرجى أختيار اسم مستخدم اخر");
                }
            });
        }

    useEffect(()=>{
        const uploadImage = async () => {
            if (userImage) {
                setLoading(true)
                const formData = new FormData();
                formData.append('file', userImage);
                formData.append('upload_preset', 'NorasZIADAhmed');
                formData.append('folder', 'userImgs');
                try {
                    const response = await fetch('https://api.cloudinary.com/v1_1/drcoqjhzb/image/upload', {
                        method: 'POST',
                        body: formData,
                    });
                    const result = await response.json();
                    if (response.ok) {
                        setUrluser(result.secure_url);
                        setLoading(false)
                    } else {
                        console.error('Error uploading image:', result.error.message);
                        setMessage('حدث خطأ أثناء رفع الصورة');
                        setLoading(false)
                    }
                } 
                catch (error) {
                    console.error('Error uploading image:', error);
                    setMessage('حدث خطأ أثناء رفع الصورة');
                    setLoading(false)
                }
            }
        };
        uploadImage();
    },[userImage])
    return (
        <div>
            <div className='signBox ch-ur'>
                {!success ? 
                    <div className='put-img'>
                        <div className='img'>
                            {!urluser ? 
                                gender === 'male' ? 
                                <div className='photoUser' style={{backgroundImage: `url(${require("../3.public/cusotmers/def.png")})`}}>
                                    {loading ? 
                                    <i className="fa fa-spinner fa-spin"></i>
                                    :
                                    null
                                    }
                                </div>
                                :
                                <div className='photoUser' style={{backgroundImage:  `url(${require("../3.public/cusotmers/default-female.jpg")})`}}>
                                    {loading ? 
                                    <i className="fa fa-spinner fa-spin"></i>
                                    :
                                    null
                                    }
                                </div>
                            :
                            <div className='photoUser' style={{backgroundImage: `url(${urluser})`}}>
                                {loading ? 
                                    <i className="fa fa-spinner fa-spin"></i>
                                    :
                                    null
                                }
                            </div>
                            }
                            <label className='choose-photo' htmlFor='photo'>
                                <span>+</span>
                            </label>
                            <input disabled={loading} id='photo' hidden type="file" onChange={(e) => setUserImage(e.target.files[0])} />
                        </div>
                        <h3>{firstname + " " + lastName}</h3>
                        <label style={{textAlign: "center"}} className='userLabel'>اضف صورة شخصية لك</label>
                        <p className='error'>{message}</p>
                        <button disabled={loading} onClick={FinishSign} className='signUpNowBtn'>أبدا في التسوق <i className="fa-solid fa-bag-shopping"></i></button>
                    </div>
                    :
                    <div style={{textAlign: "center"}}>
                    <h2>تم اضافة الصورة بنجاح</h2>
                    {mode === "dark" ?
                    <img  width={"100"} src={require("../3.public/gifs/darkscuccss.gif")} alt='success-dark' />
                    :
                    <img width={"100"} src={require("../3.public/gifs/success.gif")} alt='success-dark'/>}
                    </div>
                }
            </div>
        </div>
);
}