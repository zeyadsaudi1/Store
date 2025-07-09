import '../4.style/components2/product.css'
import { Auth } from '../context/context'
import { useContext, useState } from 'react';
import TableProduct from './tableProducts';
import Types from '../5.API/type_curtains.json'
import patternn from '../5.API/pattern.json'
import warrantyy from '../5.API/warranty.json'
import TypePer from '../5.API/type_per.json'

export default function Product() {
    const { API,
            productName,
            setProductName,
            befPrice,
            setBefPrice,
            aftPrice,
            setAftPrice,
            type,
            setType,
            percentageType,
            setPercentageType,
            percentage,
            setPercentage,
            pattern,
            setPattern,
            warranty,
            setWarranty,
            recomment,
            setRecomment,
            exacFrom,
            setExacFrom,
            exacTo,
            setExacTo,
            disc, setDisc,
            offer, setOffer,
            category,
            setCategory,
            imgProduct,
            setImgProduct,
            idEdit,
            isEdit,
            setIsEdit,
            imgProduct1, 
            setImgProduct1,
            imgProduct2, 
            setImgProduct2,
            imgProduct3, 
            setImgProduct3,
            imgProduct4, 
            setImgProduct4,
            desc,
            setDesc,
    } = useContext(Auth)

    const [loading,setLoading] = useState(false)
    const [subPhoto,setSubPhoto] = useState(null)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (!productName || !imgProduct) {
            alert('الرجاء إدخال اسم المنتج واختيار صورة المنتج');
            setLoading(false);
            return;
        }
    
        const uploadImageToCloudinary = async (image) => {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'KazanZiadFawzy');
            formData.append('cloud_name', 'dfnbgawpp');
            formData.append('folder', 'products');
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/dfnbgawpp/image/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                return data.secure_url;
            } catch (error) {
                console.error('خطأ أثناء رفع الصورة إلى Cloudinary:', error);
                throw new Error('فشل رفع الصورة');
            }
        };
    
        try {
            // رفع الصور فقط إذا كانت موجودة
            const imgProductUrl = await uploadImageToCloudinary(imgProduct);
            const imgProduct1Url = imgProduct1 ? await uploadImageToCloudinary(imgProduct1) : null;
            const imgProduct2Url = imgProduct2 ? await uploadImageToCloudinary(imgProduct2) : null;
            const imgProduct3Url = imgProduct3 ? await uploadImageToCloudinary(imgProduct3) : null;
            const imgProduct4Url = imgProduct4 ? await uploadImageToCloudinary(imgProduct4) : null;
            const subPhotoUrl = subPhoto ? await uploadImageToCloudinary(subPhoto) : null;
    
            const productData = {
                productName,
                befPrice,
                aftPrice,
                type,
                percentageType,
                percentage,
                pattern,
                warranty,
                recomment,
                exacFrom,
                exacTo,
                category,
                disc,
                offer,
                desc,
                imgProduct: imgProductUrl,
                imgProduct1: imgProduct1Url,
                imgProduct2: imgProduct2Url,
                imgProduct3: imgProduct3Url,
                imgProduct4: imgProduct4Url,
                subPhotoUrl: subPhotoUrl
            };
    
            const response = await fetch(`${API}/upload-product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
                credentials: 'include',
            });
    
            const data = await response.json();
            if (response.ok) {
                window.location.reload();
                setLoading(false);
            } else if (response.status === 400) {
                alert("المنتج المضاف خارج معيير التخزين يرجى قراءة المعيير الصحيحة");
                setLoading(false);
            } else if (response.status === 500) {
                alert("يبدو ان هناك مشكلة بالسيرفر");
                setLoading(false);
            }
        } catch (error) {
            console.error('خطأ أثناء عملية رفع المنتج:', error);
            alert('هناك مشكلة بتحميل المنتج');
            setLoading(false);
        }
    };
    
    const updateData = (e) => {
        fetch(`${API}/updatee`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                id: idEdit,        
                title: productName,
                befPrice: befPrice,
                aftPrice: aftPrice,
                type: type,
                percType: percentageType,
                percent: percentage,
                pattern: pattern,
                warranty: warranty,
                recomment: recomment,
                exacFrom: exacFrom,
                category: category,
                exacTo: exacTo,
                disc: disc,
                desc: desc,
                offer: offer,
                imgProduct1:imgProduct1,
                imgProduct2:imgProduct2,
                imgProduct3:imgProduct3,
                imgProduct4:imgProduct4,
            })
        }).then((res)=> {
            if(res.status === 200) {
                alert("تم تحيث الستارة")
                setIsEdit(false)
            }
            else {
                alert('حدث خطأ')
            }
        })
    }

    return (
        <div className="route product">
            <h2>اضافة الستائر</h2>
                <div className="parent title">
                    <div>
                        <label>العنوان</label>
                        <input
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                            type="text" placeholder="ادخل عنوان الستارة" />
                    </div>
                    <div>
                        <label>الوصف</label>
                        <input
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            type="text" placeholder="ادخل عنوان الستارة" />
                    </div>
                </div>

                {/* تفاصيل الأسعار */}
                <div className="parent price">
                    <div className="bef-pricee">
                        <label>سعر المتر عند الشراء</label>
                        <input
                            value={befPrice}
                            onChange={e => setBefPrice(e.target.value)}
                            type="text" placeholder="ادخل سعر الشراء" />
                    </div>
                    <div className="aft-price">
                        <label>سعر المتر عن البيع</label>
                        <input
                            value={aftPrice}
                            onChange={e => setAftPrice(e.target.value)}
                            type="text" placeholder="ادخل سعر البيع" />
                    </div>
                </div>
                {/* التفاصيل الأخرى */}
                <div className="parent type">
                    <div>
                        <label>النوع</label>
                        <select onChange={(e) =>setType(e.target.value)}>
                            {Types.curtains.map((e,i) =>
                            <option key={i} disabled={i === 0} selected={i === 0} value={e}>{e}</option>
                            )}
                        </select>
                        
                    </div>
                    <div>
                        <label>الصنف</label>
                        <input
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            type="text" placeholder="ادخل الصنف" />
                    </div>
                    <div className="patern">
                        <label>النقوش</label>
                        <select onChange={e => setPattern(e.target.value)}>
                            {patternn.patterns.map((e,i) =>
                            <option selected={i === 0} disabled={i === 0} key={i} value={e}>{e}</option>
                            )}
                        </select>
                    </div>
                    <div className="Warranty">
                        <label>الضمان</label>
                        <select onChange={e => setWarranty(e.target.value)}>
                            {warrantyy.warranties.map((e,i) =>
                            <option selected={i === 0} disabled={i === 0} key={i} value={e}>{e}</option>
                            )}
                        </select>
                    </div>
                </div>
                
                {/* تفاصيل النسبة */}
                <div className="parent percentage-type-percent">
                    <div className="percent-type">
                        <label>النوع النسبة</label>
                        <select onChange={e => setPercentageType(e.target.value)}>
                        {TypePer.typess.map((e, i) => 
                            <option key={i} value={e} selected={i === 0} disabled={i === 0}>{e}</option>
                        )}
                        </select>
                    </div>
                    <div className="percent-type">
                        <label>النسبة</label>
                        <input
                            disabled={percentageType === ''}
                            value={percentage}
                            onChange={e => setPercentage(e.target.value)}
                            type="text" placeholder="ادخل النسبة" />
                    </div>
                </div>
                {/* التوصيات */}
                <div className="Recommendations">
                    <label>التوصيات</label>
                    <textarea
                        value={recomment}
                        onChange={e => setRecomment(e.target.value)}
                    >
                    </textarea>
                </div>

                {/* مدة التنفيذ */}
                <div className="exection-time">
                    <div className="execute-from">
                        <label>مدة التنفيذ من</label>
                        <input
                            value={exacFrom}
                            onChange={e => setExacFrom(e.target.value)}
                            type="number" min="1" placeholder="مدة التفيذ بالأيام" />
                    </div>
                    <div className="execute-from">
                        <label>مدة التنفيذ الى</label>
                        <input
                            value={exacTo}
                            onChange={e => setExacTo(e.target.value)}
                            type="number" min={+exacFrom + 1} placeholder="مدة التفيذ بالأيام" />
                    </div>
                </div>
                <div className="discount">
                    <div className="execute-from">
                        <label>الخصم</label>
                        <input
                            value={disc}
                            onChange={e => setDisc(e.target.value)}
                            type="text" placeholder="ادخل الخصم برقم فقط او بنسبة مئوية" />
                    </div>
                    <p className='error'>ادخل الخصم برقم فقط او بنسبة مئوية</p>
                    <div className="execute-from">
                        <label>العروض</label>
                        <input
                            value={offer}
                            onChange={e => setOffer(e.target.value)}
                            type="text" placeholder="تقديم عرض" />
                    </div>
                </div>
                <div className="photo">
                    <div>
                        <label className='get-img' htmlFor='getPhoto'>
                            <span>{imgProduct !== null?imgProduct.name:<p>
                                <i className="fa-regular fa-images"></i> ضيف صورة الرئيسية (اساسي)
                                </p>}</span>
                        </label>
                        <input
                            id='getPhoto' hidden
                            onChange={(e) => setImgProduct(e.target.files[0])}
                            type="file" />
                    </div>
                </div>
                <div className='photoss'>
                    <div>
                        <label className='get-img' htmlFor='getPhoto0'>
                            <span>{imgProduct1 !== null?imgProduct1.name:
                            <p>
                            <i className="fa-regular fa-images"></i> ضيف صورة فرعية (اساسي)
                            </p>
                            }</span>
                        </label>
                        <input
                            id='getPhoto0' hidden
                            onChange={(e) => setImgProduct1(e.target.files[0])}
                            type="file" />
                    </div>
                    <div>
                        <label className='get-img' htmlFor='getPhoto1'>
                        <span>{imgProduct2 !== null?imgProduct2.name:
                        <p>
                            <i className="fa-regular fa-images"></i> ضيف صورة فرعية (اختياري)
                        </p>
                        }</span>
                        </label>
                        <input
                            id='getPhoto1' hidden
                            onChange={(e) => setImgProduct2(e.target.files[0])}
                            type="file" />
                    </div>
                    <div>
                        <label className='get-img' htmlFor='getPhoto2'>
                            <span>{imgProduct3 !== null?imgProduct3.name:
                            <p>
                                <i className="fa-regular fa-images"></i> ضيف صورة فرعية (اختياري)
                            </p>
                            }</span>
                        </label>
                        <input
                            id='getPhoto2' hidden
                            onChange={(e) => setImgProduct3(e.target.files[0])}
                            type="file" />
                    </div>
                    <div>
                        <label className='get-img' htmlFor='getPhoto3'>
                            <span>{imgProduct4 !== null?imgProduct4.name:
                            <p>
                                <i className="fa-regular fa-images"></i> ضيف صورة فرعية (اختياري)
                            </p>
                            }</span>
                        </label>
                        <input
                            id='getPhoto3' hidden
                            onChange={(e) => setImgProduct4(e.target.files[0])}
                            type="file" />
                    </div>
                </div>
                <hr/>
                <div className='thumbnail'>
                    <label className='get-img' htmlFor='getPhoto4'>
                        <span>{subPhoto !== null?subPhoto.name:
                        <p>
                            <i className="fa-regular fa-images"></i> ضيف صورة فرعية (اساسي)
                        </p>
                        }</span>
                    </label>
                    <input
                        id='getPhoto4' hidden
                        onChange={(e) => setSubPhoto(e.target.files[0])}
                        type="file" />
                </div>
                {!isEdit ? 
                loading ? 
                <button disabled>
                    <i className="fa fa-spinner fa-spin"></i> تحميل...
                </button>
                :
                <button onClick={handleSubmit}>اضافة منتج</button>
                :
                <button onClick={updateData}>تعديل المنتج</button>
                }
            <TableProduct/>
        </div>
    )
}
