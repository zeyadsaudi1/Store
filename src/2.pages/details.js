import { useContext, useEffect, useState } from 'react';
import '../4.style/page/details.css';
import { Auth } from '../context/context';
import { useLocation } from 'react-router-dom';
import TamaraPopup from '../1.components/tamara_popup';

export default function DetailsCard() {
    const { curtains,API, setLoginBar, tamarapopup, setTamaraPopup } = useContext(Auth); 
    const location = useLocation(); // استخدم useLocation في المستوى العلوي للـ component
    const [getCard, setgetCard] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [switchImg, setSwitchImg] = useState(0);
    const [number,setNumber] = useState(1);
    const [total, setTotal] = useState(0)
    const [total2, setTotal2] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState({
        width: '',
        height: '',
        chainType: '75',
        widthAdjustment: '',
        heightAdjustment: '',
    });

    const addCart = () => {
        if(!selectedOptions.width || !selectedOptions.height || !selectedOptions.chainType) {
            return;
        }
        fetch(`${API}/add-cart`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                nameProduct: getCard.title,
                img: getCard.imgsUrl[0],
                needs: selectedOptions,
                num: number,
                total_aft: total,
                total_bef: total2,
            }
            )
        }).then((res) => {
            if(res.ok) {
                window.location.reload()
            }
            else if(res.status === 400) {
                setLoginBar(true)
            }
        }).catch((err) => console.log(err))
    }

    useEffect(() => {
        const id = location.pathname.split('/').pop();

        const GetCard = (id) => {
            const card = curtains.filter((e) => e._id === id);
            return card;
        };

        const card = GetCard(id)[0];
        setgetCard(card);
        setLoading(card ? true : false);
    }, [curtains, location.pathname]);

    const handleSelectChange = (e) => {
        setSelectedOptions({
            ...selectedOptions,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (selectedOptions.width && selectedOptions.height && selectedOptions.chainType) {
            setTotal(
            (
                ((parseFloat(selectedOptions.width) + parseFloat(selectedOptions.widthAdjustment || 0)) / 100) *
                ((parseFloat(selectedOptions.height) + parseFloat(selectedOptions.heightAdjustment || 0)) / 100) *
                getCard.last_total + 
                parseFloat(selectedOptions.chainType)
            ) * number
            );
        }
    }, [selectedOptions, number]);
    useEffect(() => {
        if (selectedOptions.width && selectedOptions.height && selectedOptions.chainType) {
            setTotal2(
            (
                ((parseFloat(selectedOptions.width) + parseFloat(selectedOptions.widthAdjustment || 0)) / 100) *
                ((parseFloat(selectedOptions.height) + parseFloat(selectedOptions.heightAdjustment || 0)) / 100) *
                getCard.aft_price_per_meter + 
                parseFloat(selectedOptions.chainType)
            ) * number
            );
        }
    }, [selectedOptions, number]);

    return (
        <div className="details">
            {loading ? (
                <>
                    {tamarapopup ? <TamaraPopup month={4} price={total || getCard.last_total}/> : null}
                    <div className="left">
                        <div className="head">
                            <h2>{getCard.title}</h2>
                            <p>
                            {" " + getCard.title + "، نسبة "}{"ال"+getCard.percentage_tpye + " "}{getCard.percentage + ". النقش"} {getCard.pattern + " "}. 
                            {getCard?.desc || null}
                            مع نسبة {getCard.percentage_tpye + " " || 'لا'} {getCard.percentage + " " || ''}.
                            هذا المنتج غير جاهز ويتم تصنيعه بناءً على الطلب . <a href='#moreDet'>معرفة المزيد</a>
                            </p>
                        </div>
                        <div className="price">
                            <div className='pricee price-now'>{getCard.last_total} ريال سعودي</div>
                            <div className='pricee price-bef'><span className='bef-price'>{getCard.aft_price_per_meter} ر . س</span></div>
                            <div className='discountt'>{!Number.isInteger(getCard.discount) ? 
                            (getCard.discount * 100) + '% ' : getCard.discount   
                            }
                            الخصم <i className="fa-solid fa-fire"></i></div>
                        </div>
                        <div onClick={() => setTamaraPopup(true)} className='tamara'>
                            <img src={require("../3.public/payment/tamara.jpg")} width='100px' />
                            <p>أو قسم فاتورتك بقيمة <span></span> ع <span>4</span>  دفعات بدون رسوم تأخير، متوافقة مع <strong>الشريعة الإسلامية</strong> </p>
                        </div>
                        <form>
                            <label>عرض</label>
                            <select name="width" value={selectedOptions.width} onChange={handleSelectChange}>
                                <option value="" disabled>اختر العرض</option>
                                <option value="100">100 سم</option>
                                <option value="125">125 سم</option>
                                <option value="150">150 سم</option>
                                <option value="175">175 سم</option>
                                <option value="200">200 سم</option>
                                <option value="225">225 سم</option>
                            </select>

                            <label>الأرتفاع</label>
                            <select name="height" value={selectedOptions.height} onChange={handleSelectChange}>
                                <option value="" disabled>اختر الطول</option>
                                <option value="125">125 سم</option>
                                <option value="150">150 سم</option>
                                <option value="175">175 سم</option>
                                <option value="200">200 سم</option>
                                <option value="225">225 سم</option>
                                <option value="250">250 سم</option>
                                <option value="275">275 سم</option>
                            </select>
                            <label>نوع السلسال</label>
                            <select name="chainType" value={selectedOptions.chainType} onChange={handleSelectChange}>
                                <option value="0" disabled>اختر النوع</option>
                                <option value="80">معدني</option>
                                <option value="75">بلاستيك</option>
                            </select>

                            <label>تعديل من العرض</label>
                            <select name="widthAdjustment" value={selectedOptions.widthAdjustment} onChange={handleSelectChange}>
                                <option value="0" selected disabled>تعديل عرض الستارة</option>
                                <option value="0">بدون تعديل</option>
                                <option value="5">اضافة 5 سم للعرض</option>
                                <option value="10">اضافة 10 سم للعرض</option>
                                <option value="-5">حذف 5 سم للعرض</option>
                                <option value="-10">حذف 10 سم للعرض</option>
                            </select>

                            <label>تعديل من الطول</label>
                            <select name="heightAdjustment" value={selectedOptions.heightAdjustment} onChange={handleSelectChange}>
                                <option value="1" disabled>تعديل طول الستارة</option>
                                <option value="1">بدون تعديل</option>
                                <option value="5">اضافة 5 سم للطول</option>
                                <option value="10">اضافة 10 سم للطول</option>
                                <option value="-5">حذف 5 سم للطول</option>
                                <option value="-10">حذف 10 سم للطول</option>
                            </select>
                        </form>
                        <div className='total'>
                        <span className='bold'>
                            {total === 0 ? getCard.last_total : parseFloat(total).toFixed(2)}
                            <span>ريال سعودي</span>
                        </span>
                        الإجمالي
                        </div>
                        <div className="detailss">
                            <ul id='moreDet'>
                                <li>{getCard?.desc || 'الستائر مصنعة من اجود وافخر الخامات'}</li>
                                <li>النوع <span className='bold'>{getCard.type || 'غير معروف'}</span></li>
                                <li><span className='bold'>{getCard.warranty || 'لا يوجد ضمان'}</span></li>
                                <li><span className='bold'>{getCard.percentage_tpye === "شفافية" ? "شفاف" : "معتم"}</span> <span className='bold'>بنسبة {getCard.percentage || ''}</span></li>
                                <li>هذا المنتج غير جاهز ويتم تصنيعة بناءا على الطلب</li>
                                <li className='bold'>يرجى ملاحظة أن درجة لون الأقمشة قد تختلف قليلاً عن الواقع بسبب تفاوت مستويات الإضاءة على شاشات الأجهزة اللوحية والمحمولة.</li>
                                <li>مدة التنفيذ من <span className='bold'>{getCard.exec_from || 'غير محدد'}ايام</span> الى <span className='bold'>{getCard?.exec_to || 'غير محدد'} ايام</span> عمل</li>
                                <li>النقش <span className='bold'>{getCard.pattern || 'غير محدد'}</span></li>
                                <li className='recommand'>{<span className='bold'>{getCard.recomment}</span> || 'لا يوجد توصيات'}</li>
                            </ul>
                        </div>
                        <div className="offer">
                            <p><i className="fa-solid fa-gift"></i>{getCard.offers || "لا يوجد عرروض لهذا المنتج"}</p>
                        </div>
                    </div>
                    <div className="right">
                        <div className='main-photo' style={{backgroundImage: `url(${getCard.imgsUrl[switchImg]})`}}>
                        <div className='btns'>
                            {getCard.imgsUrl.filter((el)=> el !== null).map((e,i) => 
                            <div
                            onClick={() => setSwitchImg(i)}
                            style={{backgroundImage: `url(${getCard.imgsUrl[i]})`}}
                            ></div>
                            )}
                        </div>
                        </div>
                    </div>
                    <div className='adding'>
                        <div className='product'>
                            <div className='bg'
                            style={{backgroundImage: `url(${getCard.subPhoto})`}}
                            ></div>
                            <div className='infoProduct'>
                                <h3>{getCard.title}</h3>
                                <div className='price'>
                                <span className='current-price'>
                                    {selectedOptions.width && selectedOptions.height && selectedOptions.chainType ? 
                                    <span>{parseFloat(total).toFixed(2)} ريال سعودي</span>
                                    :
                                    <span>{getCard.last_total} ريال سعودي</span>
                                    }
                                    </span>
                                    <span className='previous-price'>
                                    {selectedOptions.width && selectedOptions.height && selectedOptions.chainType ? 
                                    <span>{parseFloat(total2).toFixed(2)} ريال سعودي</span>
                                    :
                                    <span>{getCard.aft_price_per_meter} ريال سعودي</span>
                                    }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='push'>
                                <button onClick={addCart} className='add-to-cart'>اضف الى السله <i className="fa-solid fa-cart-shopping"></i></button>
                            <div className='number'>
                                <button 
                                onClick={() => setNumber(number + 1)}
                                className='inc'>+</button><span>{number < 1 ? setNumber(1) : number}</span><button 
                                onClick={() => setNumber(number - 1)}
                                className='dec'>-</button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>تحميل البيانات...</div>
            )}
        </div>
    );
}
