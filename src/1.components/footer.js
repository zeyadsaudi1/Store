import { Link } from 'react-router-dom'
import '../4.style/components/footer.css'
export default function Footer() {
    return (
        <footer>
            <div className="scrolling"><button onClick={() =>  window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })}>العودة إلى أعلى <i className="fa-solid fa-arrow-up"></i></button></div>
            <div className='social'>
                <span>تابع ويفي على المنصات</span>
                <a target="_blank" href="https://www.tiktok.com/@wavycurtains"><i className="fa-brands fa-tiktok"></i></a>
                <a target="_blank" href="https://x.com/wavyCurtains"><i className="fa-brands fa-x-twitter"></i></a>
                <a target="_blank" href="https://www.instagram.com/wavycurtains1/"><i className="fa-brands fa-instagram"></i></a>
                <a target="_blank" href="https://www.linkedin.com/in/wavy-curtains-bbb690343/"><i className="fa-brands fa-linkedin"></i></a>
            </div>
            <div className='parent'>
                    <div className="address">
                        <img width='150' src={require('../3.public/logo/1.png')} alt="wavy"/>
                        <p>
                            الرياض، المملكة العربية السعودية
                            شارع الملك فهد، حي العليا، برج المملكة.
                        </p>
                    </div>
                    <div className="contact-us">
                        <h3>خدمة العملاء</h3>
                        <a target="_blank" href="tel:+201067640691"><i className="fa-solid fa-phone"></i></a>
                        <a target="_blank" href="https://wa.me/+201067640691?text=اهلا اريد معرفة العروض الجديدة ليدكم"><i className="fa-brands fa-whatsapp"></i></a>
                        <a target="_blank" href="mailto:mzeyad4091@gmail.com"><i className="fa-regular fa-envelope"></i></a>
                    </div>
                    <ul>
                        <li><Link>العروض</Link></li>
                        <li><Link>كوبون الخصومات</Link></li>
                        <li><Link>أخر الأخبار</Link></li>
                        <img width='40' src={require('../3.public/payment/tabby.jpg')} alt='tabby'></img>
                        <img width='40' src={require('../3.public/payment/tamara.jpg')} alt='tamara'></img>
                    </ul>
                </div>
                <p className='copyright'>جميع الحقوق محفوظة لشركة ويفي لعام 2025 &copy;</p>
        </footer>
    )
}