import { useContext, useEffect, useState } from "react"
import { Auth } from "../context/context"
import '../4.style/components2/order.css'

export default function Order() {
    const {API,orders,mode} = useContext(Auth);
    const [orderDetails,setOrderDetails] = useState([])
    const [showDetails,setShowDetails] = useState(false)
    const [loadAcceptOrder, setLoadAcceptOrder] = useState(false)
    const [loadAcceptPayment, setLoadAcceptPayment] = useState(false)


    const getDetails = (id) => {
        const detailsorder = orders.filter((e) => e._id === id);
        setOrderDetails(detailsorder[0].order_details)
        setShowDetails(true);
    }

    const handlePrint = (order) => {
        const printWindow = window.open('', '_blank');
        const orderDetailsHTML = order.order_details.map((detail) => `
            <div class="order-item">
                <h4>${detail.title_curtains}</h4>
                <ul>
                    <li><strong>نوع السلسال:</strong> ${detail.Chain}</li>
                    <li><strong>العرض:</strong> ${detail.width} سم</li>
                    <li><strong>الطول:</strong> ${detail.height} سم</li>
                    <li><strong>التعديل على العرض:</strong> ${detail.editWidth === null ? "لا تعديل" : detail.editWidth + " سم"}</li>
                    <li><strong>التعديل على الأرتفاع:</strong> ${detail.editHeight === null ? "لا تعديل" : detail.editHeight + " سم"}</li>
                    <li><strong>السعر:</strong> ${parseFloat(detail.price_curtains).toFixed(2)} ر.س</li>
                    <li><strong>العدد:</strong> ${detail.number}</li>
                </ul>
            </div>
        `).join('');
    
        const content = `
            <html>
            <head>
                <title>طباعة الطلب</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .order-details, .order-item { border: 1px solid #ccc; padding: 20px; margin-bottom: 10px; }
                    .order-details h1, .order-item h4 { color: #333; }
                    .order-details p, .order-item li { margin: 5px 0; }
                </style>
            </head>
            <body>
                <div class="order-details">
                    <h1>تفاصيل الطلب</h1>
                    <p><strong>اسم العميل:</strong> ${order.customer_name}</p>
                    <p><strong>العنوان:</strong> ${order.customer_address}</p>
                    <p><strong>الهاتف:</strong> ${order.customer_phone}</p>
                    <p><strong>طريقة الدفع:</strong> ${order.payment_method === 'cash' ? "كاش" : "فيزا"}</p>
                    <p><strong>رقم الطلب:</strong> ${order.number_order}</p>
                    <p><strong>إجمالي الطلب:</strong> ${order.total_order}</p>
                    <p><strong>حالة الاستلام:</strong> ${order.Receipt_status ? "تم الأستلام" : "لم يُستلم"}</p>
                    <p><strong>حالة الدفع:</strong> ${order.status_payment ? "تم الدفع" : "لم يُدفع"}</p>
                </div>
                <div class="order-items">
                    <h2>تفاصيل الطلبات الفردية</h2>
                    ${orderDetailsHTML}
                </div>
            </body>
            </html>
        `;
    
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.print();
    };

    const doneOrder = async (id) => {
        setLoadAcceptOrder(true)
        await fetch(`${API}/done-order`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({id:id}),
        }).then((res)=>{
            if(res.ok){
                alert(`تم استلام الطلب بنجاح قم الأن بالتحقق من الدفع - ${id}`);
                setLoadAcceptOrder(false)
            }
        }).catch((err)=> {
            setLoadAcceptOrder(false)
            console.log(err);
        })
    }
    const donePayemnt = async (id) => {
        setLoadAcceptPayment(true)
        await fetch(`${API}/done-payment`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({id:id}),
        }).then((res)=>{
            if(res.ok){
                alert(`تم استلام الدفع بنحاح طلب  - ${id}`);
            }
            else {
                alert('حدث خطأ ما');
            }
            setLoadAcceptPayment(false)
        }).catch((err)=> {
            console.log(err);
            setLoadAcceptPayment(false)
        })
    }

    return ( 
        <>
        <div className="route orders">
            {showDetails ? 
            <div className="display">
                <button onClick={() => {
                    setShowDetails(false)
                    setOrderDetails([])
                }} className="close">x</button>
                <h3>تفاصيل الطلب</h3>
                {orderDetails.map((e) =>
                <div>
                    <div className="img-title">
                        <div style={{
                            backgroundImage: `url(${e.img_curtain})`
                        }} className="bg-order"></div>
                        <h4>{e.title_curtains}</h4>
                    </div>
                    <ul>
                        <li>نوع السلسال <span className="strong">{e.Chain}</span></li>
                        <li>العرض <span className="strong">{e.width}</span>سم</li>
                        <li>الطول <span className="strong">{e.height}</span>سم</li>
                        <li>التعديل على العرض <span className="strong">{e.editWidth === null ? "لا تعديل" : e.editWidth + "سم"}</span></li>
                        <li>التعديل على الأرتفاع <span className="strong">{e.editHeight === null ? "لا تعديل" : e.editHeight + "سم"}</span></li>
                        <li>السعر<span className="strong">{parseFloat(e.price_curtains).toFixed(2)} ر.س</span></li>
                        <li>العدد منها <span className="strong">{e.number}</span></li>
                    </ul>
                </div>
                )}
            </div>
            :
            null
            }
            <h2>طلبات ويفي</h2>
            <table className="table-orders">
                <thead>
                    <tr>
                        <th></th>
                        <th>اسم العميل</th>
                        <th>عنوان العميل</th>
                        <th>رقم هاتف العميل</th>
                        <th>طريقة الدفع</th>
                        <th>عدد الطلبات</th>
                        <th>تفاصيل الطلب</th>
                        <th>حاله الأستلام</th>
                        <th>حاله الدفع</th>
                        <th>الأجمالي</th>
                        <th>الأجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((e,i)=>
                    e.Receipt_status !== true || e.status_payment !== true ? 
                    <tr key={i}>
                        {mode==="dark"?
                        <td><img src={require("../3.public/icons/pack_dark.png")} alt="pack-dark" /></td>
                        :
                        <td><img src={require("../3.public/icons/pack_light.png")} alt="pack-light" /></td>
                        }
                        <td>{e.customer_name}</td>
                        <td>{e.customer_address}</td>
                        <td>
                            <a rel="noopener noreferrer" target="_blank" href={`https://wa.me/+${e.customer_phone}?text=
                            السلام عليكم و رحمه الله و بركاته هل طلبت اوردر من ويفي?
                            `}>{e.customer_phone}</a>
                        </td>
                        <td>{e.payment_method === 'cash' ? "كاش" : "فيزا"}</td>
                        <td>{e.number_order}</td>
                        <td className="action">
                            <button onClick={() => getDetails(e._id)}>عرض</button>
                        </td>
                        <td className="Receipt_status"
                        style={e.Receipt_status ? {color: "green"} : {color: "var(--danger)"}}
                        >{e.Receipt_status ? "تم الأستلام" : "لم يُستلم"}</td>
                        <td className="payment_status" style={e.status_payment ? {color: "green"} : {color: "var(--danger)"}}>{e.status_payment ? "تم الدفع" : "لم يُدفع"}</td>
                        <td>{e.total_order}</td>
                        <td className="action">
                            <button onClick={()=>handlePrint(e)}>طباعة</button>
                            <button disabled={loadAcceptOrder} onClick={()=>doneOrder(e._id)}>
                                {loadAcceptOrder ? "جار التحقق"  : "تم الأستلام"}
                            </button>
                            <button className={e.status_payment ? "disable" : null} disabled={e.status_payment || loadAcceptPayment} onClick={()=>donePayemnt(e._id)}>
                                {loadAcceptPayment ? "يتم التحقق..." : "تم الدفع"}
                            </button>
                        </td>
                    </tr>
                    :
                    null
                    )}
                </tbody>
            </table>
        </div>
        </>
    )
}