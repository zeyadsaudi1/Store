import { useContext, useState } from 'react'
import '../4.style/components/productsCart.css'
import { Auth } from '../context/context'

export default function ProductCart(props) {
    const {API} = useContext(Auth)
    const [isLoading, setIsLoading] = useState(false);

    const DeleteProductFromCart = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API}/delete-cart-item/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (response.status === 200) {
                const result = await response.json();
                window.location.reload();
            } else {
                const error = await response.json();
                console.error("خطأ أثناء الحذف:", error.message);
                alert("تعذر حذف العنصر. حاول مرة أخرى.");
            }
        } catch (error) {
            console.error("خطأ في الطلب:", error);
            alert("حدث خطأ أثناء الحذف.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="productOfCart">
            <div className="head">
                <div style={{backgroundImage: `url(${props.img})`}} className="bg_cart"></div>
                <div className="inforProduct">
                    <h2>{props.title}</h2>
                    <div className="price">{props.price} ريال سعودي</div>
                </div>
            </div>
            <div className='detailss'>
                <h3>تفاصيل الطلب</h3>
                <div className="parent">
                    <div>العدد</div>
                    <div>{props.num}</div>
                </div>
                <div className="parent">
                    <div>نوع السلسال</div>
                    <div>{props.chainType}</div>
                </div>
                <div className="parent">
                    <div>العرض</div>
                    <div>{props.width}</div>
                </div>
                <div className="parent">
                    <div>الأرتفاع</div>
                    <div>{props.height}</div>
                </div>
                <div className="parent">
                    <div>التعديل من الطول</div>
                    <div>{props.edit_from_width}</div>
                </div>
                <div className="parent">
                    <div>التعديل من الأرتفاع</div>
                    <div>{props.edit_from_height}</div>
                </div>
            </div>
            <div className="action">
                <button
                    onClick={() => DeleteProductFromCart(props.id)}
                    className="del"
                    disabled={isLoading}
                >
                    حذف {isLoading ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa-solid fa-trash"></i>}
                </button>
                <button className="fav">اضف الى الأمنيات <i className="fa-solid fa-heart"></i></button>
            </div>
        </div>
    )
}