import { useContext, useEffect, useState } from 'react';
import '../4.style/components2/ads.css';
import { Auth } from '../context/context';

export default function Ads() {
    const [adImg, setAdImg] = useState(null);
    const [textad, setTextad] = useState('');
    const [urlAd, setUrlAd] = useState('');
    const [accept, setAccept] = useState(false);
    const { mode, API } = useContext(Auth);
    const [loading,setLoading]=useState(false)

    useEffect(() => {
        if (adImg && urlAd.length > 12) {
            setAccept(true);
        } else {
            setAccept(false);
        }
    }, [adImg, urlAd]);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "zebraZiadFawzy"); 
        formData.append('folder', 'ads');
        const response = await fetch("https://api.cloudinary.com/v1_1/dfnbgawpp/image/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        return data.secure_url;
    };

    const HandleAds = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const adImageUrl = await uploadToCloudinary(adImg[0]); 
            const Data = {
                ads: adImageUrl,
                title: textad,
                url: urlAd,
            };

            const response = await fetch(`${API}/send-ad`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                setLoading(false)
            }
            
            setAdImg(null);
            setTextad('');
            setUrlAd('');
            setLoading(false)
        } catch (error) {
            console.error("حدث خطأ أثناء الإرسال:", error);
            setLoading(false)
        }
    };

    return (
        <div className="route ads">
            <h2>الأعلانات</h2>
            <h3>اعلان جديد</h3>
            <br />
            <form onSubmit={HandleAds}>
                <label style={adImg !== null ? { backgroundColor: "green" } : null} className='imgadd' htmlFor='advertisement'>
                    <span>{adImg !== null ? adImg[0].name : <span><i className="fa-solid fa-rectangle-ad"></i> ضيف صورة للأعلان</span>}</span>
                </label>
                <input hidden onChange={(e) => setAdImg(e.target.files)} id='advertisement' type="file" />
                <label>عنوان الأعلان</label>
                <input value={textad} onChange={(e) => setTextad(e.target.value)} className='inp' type="text" placeholder="(اكتب او نبذه سريعة (اختياري" />
                <p>ادخل النص الذي سوف يظهر على اعلانك</p>
                <label>ادخل عنوان url</label>
                <input className='inp' value={urlAd} onChange={(e) => setUrlAd(e.target.value)} type="text" placeholder="ادخل عنوان url مثل (https://example.com)" />
                <button disabled={!accept || loading} style={accept ? { backgroundColor: "green" } : null} type='submit'>
                    {loading ? <i className="fa fa-spinner fa-spin"></i> : null}
                    نشر الأعلان
                    {mode === 'dark' ?
                        <img src={require('../3.public/icons/ads-dark.png')} alt="ads-dark" /> :
                        <img src={require('../3.public/icons/ads-light.png')} alt="ads-light" />}
                </button>
            </form>
        </div>
    );
}
