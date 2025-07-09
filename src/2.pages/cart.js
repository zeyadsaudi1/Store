import { useContext, useEffect, useState } from "react"
import { Auth } from "../context/context"
import ProductCart from "../1.components/productsCart"
import '../4.style/page/cart.css'
import Logo from "../1.components/logo"
import DoneOrder from "../1.components/acceptorder"

export default function Cart() {
    const {user,totalPriceProduct,numsProductCart,cart,API, setLoginBar} = useContext(Auth)
    const [statusOrder,setStatusOrder] = useState(false)
    const [fullname,setFullName] = useState(localStorage.getItem("cusName") || "")
    const [address,setAddress] = useState(localStorage.getItem("cusAddress") || "")
    const [loading, setLoading] = useState(false);
    const [meessage,setMessage] = useState("")
    const [paypalCart,setPaypalCart] = useState([])
    const [paymentMethod, setPaymentMethod] = useState("cash")
    const [loadingBox,setLoadingBox] = useState(false)

    useEffect(() => {
        const updatedCart = cart.map((e) => {
            return {
                name: e.nameProduct,
                quantity: e.num,
                unit_amount: parseFloat(e.total_aft / e.num).toFixed(2),
            };
        });
        setPaypalCart(updatedCart);
    }, [cart]);

    const orderNow = async (payment_tpye,cartLen,total) => {
       if(fullname.length > 10 && cart.length > 0) {
        if(address.length > 20) {
            setLoading(true);
            try {
                const response = await fetch(`${API}/new-order`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        number_products: cartLen,
                        name: fullname,
                        addresss: address,
                        order_details: cart,
                        totalPriceProduct: total,
                        payment_method: payment_tpye,
                    }),
                });
    
                if (response.ok) {
                    setStatusOrder(true)
                    const url = new URL(window.location.href);
                    url.search = '';
                    window.history.pushState({}, '', url.toString());
                    setInterval(() => {
                        window.location.reload();
                    }, 3000);
                } else {
                    console.error("Failed to save the order.");
                    alert("حدث خطأ أثناء حفظ الطلب.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("حدث خطأ أثناء إرسال الطلب.");
            } finally {
                setLoading(false);
            }
        }
        else {
            setMessage("يرجى كتابة العنوان بالتفصيل الا يقل عن 20 احرف")
        }
    }
    else{
        setMessage("يرجى كتابة الأسم بالكامل الا يقل عن 10 احرف")
    }
    };

    useEffect(() => {
        localStorage.setItem("cusName", fullname);
        localStorage.setItem("cusAddress", address);
      }, [fullname, address]);

    const handleNameChange = (e) => {
        setFullName(e.target.value);
      };
    
      const handleAddressChange = (e) => {
        setAddress(e.target.value);
      };

    const Paypal_Checkout = () => {
        if(fullname.length > 10 && cart.length > 0) {
            if(address.length > 20) {
                localStorage.setItem('cusName',fullname);
                setLoadingBox(true)
                fetch(`${API}/payment-checkout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: paypalCart,
                    })
                })
                    .then((res) => {
                        // تحقق أولاً من حالة الاستجابة (status)
                        if (!res.ok) {
                            return res.text().then((text) => {
                                throw new Error(`Error: ${text}`); // خطأ في الاستجابة، إرجاع نص الخطأ
                            });
                        }
                        // إذا كانت الحالة OK، حول الاستجابة إلى JSON
                        return res.json();
                    })
                    .then((res) => {
                        setLoadingBox(false);
                        // تحقق من أن `res.url` موجود قبل التوجيه
                        if (res.url) {
                            window.location.assign(res.url);
                        } else {
                            console.error("Missing URL in response");
                        }
                    })
                    .catch((err) => {
                        setLoadingBox(false);
                        console.error("Error during payment checkout:", err);
                    });
                
            }
            else {
                setMessage("يرجى كتابة العنوان بالتفصيل الا يقل عن 20 احرف")
            }
        }
        else{
            setMessage("يرجى كتابة الأسم بالكامل الا يقل عن 10 احرف")
        }
    }

    const verifyPayment = async () => {
            const token = new URLSearchParams(window.location.search).get("token");
            if (token) {
                setLoadingBox(true)
                try {
                    const response = await fetch(`${API}/complete-order?token=${token}`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data.message === "تم الدفع بنجاح") {
                            setPaymentMethod("visa");
                            const total = await cart.reduce((a,b)=> a + b.total_aft, 0).toFixed(2);
                            orderNow("visa",cart.length,total);
                            setTimeout(() => {
                                setLoadingBox(false)
                            }, 1000);
                        }
                    } else {
                        alert("فشل في التحقق من الدفع.");
                    }
                } catch (error) {
                    console.error("Error during payment verification:", error);
                    alert("حدث خطأ أثناء التحقق من الدفع.");
                }
            }
        };
    
        useEffect(() => {
            if(window.location.pathname.includes("/complete-order")) {
                verifyPayment();
            }
        }, []);
    
        const cancelPayemnt = async () => {
            const token = new URLSearchParams(window.location.search).get("token");
            console.log(token)
            if (token) {
                setLoadingBox(true)
                try {
                    const response = await fetch(`${API}/cancel-order?token=${token}`, {
                        method: "GET",
                        credentials: "include",
                    });
                    if (response.ok) {
                        window.location.pathname = '/cart';
                    }
                } catch (error) {
                    console.error("Error during payment verification:", error);
                    alert("حدث خطأ أثناء التحقق من الدفع.");
                }
            }
        };
    
        useEffect(() => {
            if(window.location.pathname.includes("/cancel-order")) {
                cancelPayemnt()
            }
        }, []);

    return (
        <>
        {statusOrder ? <DoneOrder/> : null}
        {loadingBox ? <div className="loadBox">
            <img src={require("../3.public/gifs/loading.gif")} alt="load" />
        </div>:null}
        {user.active ? 
        <div className="cart">
            <div className="cart_of_pricing">
                <h2>سله المشتريات</h2>
                <h4>عدد المنتجات <span>{numsProductCart}</span></h4>
            </div>
            <div className="parent">
                <div className="bushbox">
                    <div className="address">
                        <h3>تفاصيل العنوان</h3>
                        <input type="text" placeholder="اكتب الأسم بالكامل بالتفصيل" onChange={handleNameChange} value={fullname} />
                        <input type="text" placeholder="اكتب  عنوانك بالتفصيل" onChange={handleAddressChange} value={address} />
                        <input type="text" disabled value={user.phone} />
                        <p className="error">{meessage}</p>
                    </div>
                    <div className="check">
                        <h3>ملخص الطلب</h3>
                        <div className="total">
                            <p>تفاصيل الطلب</p>
                            <div className="totalproducts">
                                <p>الأجمالي</p>
                                <span>{totalPriceProduct || 0} ريال سعودي</span>
                            </div>
                            {/* <div className="totalproducts">
                                <p>الدفع</p>
                                <span>{paymentMethod === 'cash' ? "كاش (عند الأستلام)" : "فيزا"}</span>
                            </div> */}
                        </div>
                        <p className="note">هذا غير شامل التركيب الا للرياض فقط</p>
                        <button className="orderNow" onClick={() => orderNow('cash',numsProductCart,totalPriceProduct)} disabled={loading}>
                            {loading ? "جارٍ الحفظ..." : "اتمام الطلب"}
                        </button>
                        <br/>
                        <p>طرق الدفع الممكنة حاليا</p>
                        <div className="payment-online">
                            <button onClick={Paypal_Checkout} className="paymentTabbyy">
                                <img className="paypal" src={require("../3.public/payment/paypal.png")} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="proudcts">
                {cart.map((e) => 
                    <ProductCart 
                    id={e.id}
                    price={parseFloat(e.total_aft).toFixed(2)} 
                    img={e.img} 
                    title={e.nameProduct} 
                    num={e.num || 1}
                    width={e.needs.width + 'سم'}
                    height={e.needs.height + 'سم'}
                    chainType={e.needs.chainType === 75 ? "بلاستيك شديد التحمل" : "معدني"}
                    edit_from_width={e.needs.widthAdjustment !== null ? e.needs.widthAdjustment + 'سم' : 'لا يوجد'}
                    edit_from_height={e.needs.heightAdjustment !== null ? e.needs.heightAdjustment + 'سم' : 'لا يوجد'}
                    />
                )}
                </div>
            </div>
        </div>
        :
        <div className="sayToUser">
            <Logo size={150}/>
            <p>يرجى تسجيل الدخول لكي تستطيع الشرا ء من ويفي</p>
            <button onClick={() => setLoginBar(true)}>يرجى تسجيل الدخول</button>
        </div>
        }
        </>
    )
}