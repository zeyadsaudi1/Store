import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../context/context";
import Logo from "../1.components/logo";
import '../4.style/components2/navigatePanel.css'

export default function NavigatePanel() {
    const {mode} = useContext(Auth);
    const [activate,setActivate] = useState('dashboard')
    return (
        <nav className="nav-dashboard">
            <h1>
                <Logo />
            </h1>
            <ul>
                <li onClick={() => setActivate('dashboard')}
                className={activate === 'dashboard' ? 'active' : null}
                ><Link to='/admin'>الصفحة الرئيسية {mode==='dark'?
                <img src={require("../3.public/icons/dashboard-dark.png")} alt="dash-drk" />:
                <img src={require("../3.public/icons/dashboard-light.png")} alt="dash-lit"/>
                }</Link></li>
                <li 
                onClick={() => setActivate('users')}
                className={activate === 'users' ? 'active' : null}
                ><Link to='/admin/users'>المستخدمين <i className="fa-solid fa-user"></i></Link></li>
                <li 
                onClick={() => setActivate('collaborative')}
                className={activate === 'collaborative' ? 'active' : null}
                ><Link to='/admin/collaborative'>منتجات اخرى <i className="fa-solid fa-handshake"></i></Link></li>
                <li 
                onClick={() => setActivate('reports')}
                className={activate === 'reports' ? 'active' : null}
                ><Link to='/admin/reports'>التقارير 
                {mode === 'dark' ? 
                <img src={require('../3.public/icons/monitor-dark.png')} alt="ads-dark"/>:
                <img src={require('../3.public/icons/monitor-light.png')} alt="ads-light"/>
                }
                </Link></li>
                <li 
                onClick={() => setActivate('product')}
                className={activate === 'product' ? 'active' : null}
                ><Link to='/admin/products'>ستائر 
                {mode==='dark'?
                <img src={require("../3.public/icons/product-dark.png")} alt="dash-drk" />:
                <img src={require("../3.public/icons/product-light.png")} alt="dash-lit"/>
                }
                </Link></li>
                <li 
                onClick={() => setActivate('ads')}
                className={activate === 'ads' ? 'active' : null}
                ><Link to='/admin/advertisements'>الأعلانات 
                {mode === 'dark' ? 
                <img src={require('../3.public/icons/ads-dark.png')} alt="ads-dark"/>:
                <img src={require('../3.public/icons/ads-light.png')} alt="ads-light"/>
                }
                </Link></li>
                <li 
                onClick={() => setActivate('orders')}
                className={activate === 'orders' ? 'active' : null}
                ><Link to='/admin/order'>الطلبات 
                {mode === 'dark' ? 
                <img src={require('../3.public/icons/orders-dark.png')} alt="ads-dark"/>:
                <img src={require('../3.public/icons/orders-light.png')} alt="ads-light"/>
                }
                </Link></li>
                <li><button className="exit" 
                onClick={()=>window.location.pathname = '/'}
                >الخروج <i className="fa-solid fa-arrow-right-from-bracket"></i></button></li>
            </ul>
        </nav>
    )
}