import { useContext, useState } from "react"
import { Auth } from "../context/context"
import '../4.style/components2/users.css'

export default function GetUsers() {
    const {loadingusers,userss} = useContext(Auth);
    // const [namePerson,setNamePerson] = useState('')
    const [phone,setPhone] = useState('')
    return (
        <div className="route users">
            <h2>المستخدمين</h2>
            <div className="control">
                {/* <input type="text" value={namePerson} onChange={(e)=>setNamePerson(e.target.value)}  placeholder="ابحث بأسم الشخص" /> */}
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="ابحث برقم الهاتف" />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>الرقم التعريفي</th>
                        <th>رقم الهاتف</th>
                        <th>الصلاحية</th>
                        {/* <th>الحاله</th> */}
                        <th>الأجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    loadingusers ?
                    userss.filter(el => 
                        el.phone.includes(phone) 
                        ).map((e,i) =>
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{e.phone}</td>
                        <td>{e.role === 'admin'? "مدير":"مستخدم"}</td>
                        <td style={e.logged ? {color: "green"} : {color: "red"}}>{e.logged ? "متصل الأن" : "غير متصل"}</td>
                        {/* <td className="lock-space">
                            <button className="lockBtn"><i className="fa-solid fa-lock"></i>تعليق الحساب</button>
                        </td> */}
                    </tr>
                    // loadingusers ?
                    // userss.filter(el => 
                    //     el.firstName.toLowerCase().includes(namePerson) && el.phone.includes(phone) 
                    //     ).map((e,i) =>
                    // <tr key={i}>
                    //     <td>{i + 1}</td>
                    //     <td>{e.firstName + " " + e.lastName}</td>
                    //     <td>{e.address}</td>
                    //     <td>{e.phone}</td>
                    //     <td>{e.email}</td>
                    //     <td>{e.isMale === true ? "ذكر" : "أنثى"}</td>
                    //     <td>{e.role === 'admin'? "مدير":"مستخدم"}</td>
                    //     <td>
                    //         <div className="user-img"
                    //         style={{backgroundImage: `url(${e.profileImg})`}}
                    //         >
                    //             <div className={e.logged ? "statusLog logged" : "statusLog nonLogged"}></div>
                    //         </div>
                    //     </td>
                    //     <td className="lock-space">
                    //         <button className="lockBtn"><i className="fa-solid fa-lock"></i>تعليق الحساب</button>
                    //     </td>
                    // </tr>
                    
                    )
                    :
                    <tr>
                        <td colSpan={10}>جار تحميل البيانات...</td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}