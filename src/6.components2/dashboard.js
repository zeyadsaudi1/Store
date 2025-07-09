import { useContext, useEffect, useState } from "react";
import { Auth } from "../context/context";
import '../4.style/components2/dashboard.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from "swiper/modules";

export default function Dashboard() {
    const { user,userss,orders } = useContext(Auth);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval); 
    }, []);

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return (
        <div className="route dashboard">
            <div className="me">
                <div className="myImg" style={{
                    backgroundImage: `url(${require("../3.public/logo/1.png")})`
                }}></div>
                <div className="info-me">
                    <h2>اهلا بعودتك استاذ {user.fullName || "Zeyad "} <i className="fa-regular fa-face-smile"></i></h2>
                    <p className={user.active ? "loggedText" : "nonLoggedText"}>{user.active ? "متصل الأن" : null}</p>
                </div>
            </div>
            <h3>اخر الأخبار</h3>
            <div className="last-news">
                <div className="nums-users">
                    <h4><i className="fa-solid fa-users"></i> عدد المستخدمين الحالي <span className="value">{userss.length} مستخدمين</span></h4>
                </div>
                <div className="nums-orders">
                    <h4><i className="fa-solid fa-box-open"></i> عدد الطلبات الحالي <span className="value">{orders.length} طلبات</span></h4>
                </div>
                <div className="ave-net-profit">
                    <h4><i className="fa-solid fa-coins"></i> متوسط الأرباح حاليا <span className="value">300 ريال سعودي</span></h4>
                </div>
                <div className="ave-net-profit">
                    <h4><i className="fa-regular fa-star"></i> معدل الإقبال <span className="value per-100-90"><i className="fa-regular fa-face-smile"></i> 100%</span></h4>
                </div>
            </div>
            <div className="last-rate">
                <h3>الأراء الأخيرة</h3>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                >
                    <SwiperSlide>
                        <div className="review">
                            <h4>- عميل 1</h4>
                            <p>"منتج ممتاز! أنا راضي جدًا عن الخدمة."</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="review">
                            <h4>- عميل 2</h4>
                            <p>"التوصيل كان سريع جدًا والمندوب كان لطيفًا."</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="review">
                            <h4>- عميل 3</h4>
                            <p>"جودة المنتج أفضل مما توقعت. سأشتري مرة أخرى."</p>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="last-order-done">
                <h3>طلبات تم تسلمها في الساعة {hours}:{minutes}<i className="fa-regular fa-clock"></i></h3>
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>رقم الطلب</th>
                                <th>اسم العميل</th>
                                <th>عنوان العميل</th>
                                <th>تكلفة الطلب</th>
                                <th>الربح</th>
                                <th>تفاصيل الطلب</th>
                                <th>حاله الطلب</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.slice(-3).map((e,i) => 
                                <tr key={i}>
                                <td>{orders.length - i}</td>
                                <td>{e.customer_name}</td>
                                <td>{e.customer_address}</td>
                                <td>
                                    <a target="_blank" href={`https://wa.me/+${e.customer_phone}?text=
                                    السلام عليكم و رحمه الله و بركاته هل طلبت اوردر من ويفي?
                                    `}>{e.customer_phone}</a>
                                </td>
                                <td>{e.payment_method === 'cash' ? "كاش" : "فيزا"}</td>
                                <td>{e.number_order}</td>
                                <td
                                style={e.Receipt_status ? {backgroundColor: "green"} : {backgroundColor: "var(--danger)"}}
                                >{e.Receipt_status ? "تم الأستلام" : "لم يُستلم"}</td>
                                <td style={e.status_payment ? {backgroundColor: "green"} : {backgroundColor: "var(--danger)"}}>{e.status_payment ? "تم الدفع" : "لم يُدفع"}</td>
                                <td>{e.total_order}</td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
