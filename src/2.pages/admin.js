import { Outlet } from "react-router-dom";
import NavigatePanel from "../6.components2/navigatePanel";
import '../4.style/page/admin.css';
import { useContext, useEffect } from "react";
import { Auth } from "../context/context";

export default function Admin() {
    const {showImg,API,setShowIMg,setOrders,userss, setUsers,setLoadingusers} = useContext(Auth)
    useEffect(() => {
        const fetchOrders = () => {
            fetch(`${API}/getAll-orders`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else if (res.status === 404) {
                        return null;
                    } else {
                        alert("حدث خطأ في سيرفر");
                    }
                })
                .then((result) => {
                    if (result !== null) {
                        // تحديث الطلبات
                        setOrders(result.orders);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching orders:", err);
                });
        };
    
        fetchOrders();
    
        // التحديث كل 5 ثوانٍ
        const interval = setInterval(fetchOrders, 5000);
    
        // تنظيف عند إزالة الكومبوننت
        return () => clearInterval(interval);
    }, [API]);
    

  useEffect(()=>{
    fetch(`${API}/get-users`, {
        method: "GET",
        headers: {
            "Content-Type":"application/json"
        },
        credentials: 'include'
    }).then((res)=> {
        if(res.ok) {
            return res.json()
        }
    }).then((result)=>{
        setUsers(result.data)
        setLoadingusers(true)
    }).catch((er) => console.log("something wrong!"))
},[API, userss])

  return (
    <div className="control-page-main">
      {showImg ? 
      <div className="showImg">
        <button onClick={()=>setShowIMg('')}>X</button>
        <div style={{backgroundImage: `url(${showImg})`}} className="bg">
        </div>
      </div>
      :null
      }
      <NavigatePanel />
      <Outlet />
    </div>
  );
}
