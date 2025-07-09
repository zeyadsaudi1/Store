import { useContext } from 'react'
import '../4.style/components/tamarapopup.css'
import { Auth } from '../context/context'

export default function TamaraPopup(props) {
    const { setTamaraPopup } = useContext(Auth)
    return (
        <div className='tamara-env'>
            <div className='tamara-box'>
                <button onClick={()=>setTamaraPopup(false)} className='close'>X</button>
                <img className='logo-tamara' width={"250px"} src={require("../3.public/payment/Tamara2-01.png")}/>
                <p className='payement-total'>قسم فاتورتك بقيمة {parseFloat(props.price / props.month).toFixed(2) || 0} ر.س على {props.month} دفعات</p>
                <ul>
                    <li>
                        <div className='fet'>
                        <i className="fa-solid fa-money-bills"></i>
                        </div>
                        <p>أكمل دفعتك الأولى</p>
                    </li>
                    <li>
                        <div className='fet'>
                            <img width='30' src={require("../3.public/payment/add-user.png")} />
                        </div>
                        <p>أضف بياناتك</p>
                    </li>
                    <li>
                        <div className='fet'>
                            <img width='30' src={require("../3.public/payment/logo.png")} />
                        </div>
                        <p>اختر تمارا عند الدفع</p>
                    </li>
                    <li>
                        <div className='fet'>
                            <img width='30' src={require("../3.public/payment/cart.png")} />
                        </div>
                        <p>أضف المنتجات إلى سلة التسوق</p>
                    </li>
                </ul>
                <p className='det-tamara'>ادفع باقي المبلغ حسب خطة الدفع المختارة</p>
                <div className='second-part-tamara'>
                    <h5>لماذا اختار تمارا كوسيلة دفع؟</h5>
                    <ul>
                    <li>
                        <div className='can'>
                            <i className="fa-regular fa-face-smile-beam"></i>
                        </div>
                        <p>مرنة</p>
                    </li>
                    <li>
                        <div className='can'>
                        <i className="fa-regular fa-credit-card"></i>
                        </div>
                        <p>وسيلة دفع موثوقة وآمنة</p>
                    </li>
                    <li>
                        <div className='can'>
                            <img src={require("../3.public/payment/halal.png")} />
                        </div>
                        <p>أضف بياناتك</p>
                    </li>
                </ul>
                <p className='show-tamara-page'>هل تريد معرفة المزيد؟ <a target='_blank' href='https://tamara.co/en-SA#how-it-works'>انقر هنا</a></p>
                <p className='show-tamara-page policy-tamara'>
                (1) تطبّق الشروط و الأحكام, (2) موافقة للشريعة الإسلامية, (3) متوفرة للعملاء في السعودية والإمارات (4) قد تختلف خطة الدفع المقدمة لك تبعًا لتاريخك الائتماني مع تمارا*.
                </p>
                </div>
            </div>
    </div>
    )
}