import React, { useContext, useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Auth } from "../context/context";

export default function Reports() {
    const { orders } = useContext(Auth);
    const [getTotal, setGetTotal] = useState([]);


    useEffect(() => {
        const formattedData = orders.filter((e) => e.status_payment).map(order => ({
            month: order.month,
            total_order: order.total_order
        }));
        setGetTotal(formattedData);
    }, [orders]);

    return (
        <div className="report-container route">
            <div className="reports route" style={{ height: "400px", width: "100%" }}>
                <h2>تقارير ويفي</h2>
                <p style={{fontSize: "25px"}}>الأجمالي حاليا: <b style={{color: "var(--success)"}}>{parseFloat(getTotal.reduce((a, b) => a + (b.total_order || 0), 0)).toFixed(2)}</b> ريال سعودي</p>
                <p style={{fontSize: "18px"}}>المتوسط الأجمالي حاليا: <b style={{color: "var(--success)"}}>{parseFloat(getTotal.reduce((a, b) => a + (b.total_order || 0), 0) / getTotal.length).toFixed(2)}</b> ريال سعودي</p>
                <ResponsiveContainer>
                    <LineChart
                        data={getTotal}
                        margin={{ top: 50, right: 30, left: 20, bottom: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: "الشهور", position: "insideBottom", offset: -10 }} />
                        <YAxis label={{ value: "إجمالي الطلب", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total_order" stroke="#8884d8" name="إجمالي الطلب" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <br/>
            <div>
                <h3>الطلبات المسلمة</h3>
                <table className="table-orders">
                <thead>
                    <tr>
                        <th>اسم العميل</th>
                        <th>رقم هاتف العميل</th>
                        <th>عدد الطلبات</th>
                        <th>حاله الأستلام</th>
                        <th>حاله الدفع</th>
                        <th>الأجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((e,i)=>
                    e.Receipt_status === true || e.status_payment === true ? 
                    <tr key={i}>
                        <td>{e.customer_name}</td>
                        <td>
                            <a rel="noopener noreferrer" target="_blank" href={`https://wa.me/+${e.customer_phone}?text=
                            السلام عليكم و رحمه الله و بركاته هل طلبت اوردر من ويفي?
                            `}>{e.customer_phone}</a>
                        </td>
                        <td>{e.number_order}</td>
                        <td className="Receipt_status"
                        style={e.Receipt_status ? {color: "green"} : {color: "var(--danger)"}}
                        >{e.Receipt_status ? "تم الأستلام" : "لم يُستلم"}</td>
                        <td className="payment_status" style={e.status_payment ? {color: "green"} : {color: "var(--danger)"}}>{e.status_payment ? "تم الدفع" : "لم يُدفع"}</td>
                        <td>{e.total_order} ر.س</td>
                    </tr>
                    :
                    null
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
}
