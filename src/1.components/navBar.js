import { Link } from "react-router-dom";
import Logo from "./logo";
import '../4.style/components/navBar.css'
import { useContext, useState } from "react";
import { Auth } from "../context/context";

export default function NavBar() {
    const {setNavBar,mode, setMode, user, API} = useContext(Auth);
    const [open,setOpen] = useState(false)
    const toggleTheme = () => {
        const newTheme = mode === 'light' ? 'dark' : 'light';
        setMode(newTheme);
        document.body.classList.toggle('dark-mode', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };

    const LogoutHandle = () => {
        fetch(`${API}/logout`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type":"application/json",
            },
        }).then((res) => {
            if(res.ok) {
                window.location.pathname = '/'
            }
        })
    }

    return (
        <div className="nav">
            <div className="nav-box">
            <button onClick={toggleTheme}>
                    {mode === 'light' 
                        ? <i className="fa-solid fa-moon"></i>
                        : <i className="fa-solid fa-sun"></i>}
                </button>
                {user.isactive ? 
                <div className='name-of-user'><i className="fa-regular fa-user"></i> مرحبا استاذ <strong>{user.fullName}</strong></div>
                :null
                }
                <div className="top">
                    <h2><Logo size="100"/></h2>
                    <button onClick={()=> setNavBar(false)} className="close">X</button>
                </div>
                <ul>
                    <li>{!open?
                    <button onClick={()=>setOpen(true)}>ستائر قماش <i className="fa-solid fa-chevron-down"></i></button>
                    :
                    <button onClick={()=>setOpen(false)}>ستائر قماش <i className="fa-solid fa-chevron-down"></i></button>
                    }
                    {open ?<ul className="sublinks">
                        <li><Link to={'/curtains'}>نظام أمريكي</Link></li>
                        <li><Link to={'/curtains'}>ظام كلاسيكي</Link></li>
                        <li><Link to={'/curtains'}>نظام روماني</Link></li>
                        <li><Link to={'/curtains'}>نظام الويفي</Link></li>
                    </ul>
                    :null
                    }
                    </li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/skylightCurtains'>مظلة اسكاي لايت</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/roleCurtains'>ستائر رول</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/ironCurtains'>ستائر معدنية</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/woodenCurtains'>ستائر خشبية</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/beanbag'>بين باج ويفي</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/zebracurtains'>ستائر زيبرا</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/verCurtains'>ستائر عمودية</Link></li>
                    <li><Link 
                    onClick={() => setNavBar(false)}
                    to='/hospitalCurtains'>ستائر مستشفيات</Link></li>
                </ul>
                <div className="social">
                    <a target="_blank" href="https://www.snapchat.com/add/wavycurtains1?share_id=PVlSd-Kbgd4&locale=ar-EG "><i className="fa-brands fa-snapchat"></i></a>
                    <a target="_blank" href="https://www.instagram.com/wavycurtains1/"><i className="fa-brands fa-instagram"></i></a>
                    <a target="_blank" href="https://www.linkedin.com/in/wavy-curtains-bbb690343/"><i className="fa-brands fa-linkedin"></i></a>
                    <a target="_blank" href="
                    https://t.me/eng_ziadFawzy?start=%D8%A3%D9%87%D9%84%D8%A7%D9%8B%20%D9%88%D8%B3%D9%87%D9%84%D8%A7%D9%8B%21%20%E2%9C%A8%20%20%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D8%A2%D8%AE%D8%B1%20%D8%B9%D8%B1%D9%88%D8%B6%20Wavy%D8%8C%20%D9%88%D8%A3%D9%83%D9%88%D9%86%20%D9%85%D9%85%D8%AA%D9%86%D9%8B%D8%A7%20%D9%84%D8%AA%D9%88%D8%B6%D9%8A%D8%AD%20%D8%A7%D9%84%D8%AA%D9%81%D8%A7%D8%B5%D9%8A%D9%84.%20
                    "><i className="fa-brands fa-telegram"></i></a>
                </div>
                {user.active ?
                // <button onClick={LogoutHandle} className="logoutBtn"><i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج</button>
                <button onClick={LogoutHandle} className="logoutBtn"><i className="fa-solid fa-right-from-bracket"></i> تسجيل الخروج</button>
                :
                null
                }
            </div>
        </div>
    )
}