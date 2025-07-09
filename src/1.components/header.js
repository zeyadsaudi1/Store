import {Link} from 'react-router-dom'
import Logo from './logo'
import '../4.style/components/header.css'
import { useContext, useEffect, useState } from 'react'
import { Auth } from '../context/context';
export default function Header() {
    const { setSearchBar, setNavBar,mode,setLoginBar, user, cart, loadCart, setLoadCart,
        totalPriceProduct,setTotalPriceProduct,
        numsProductCart,setNumsProductCart
    } = useContext(Auth);
    const [Yaxis,setYaxis] = useState(0)
    const [showUserName,setShowUserName] = useState(false)
    const [statusHeader, setStatusHeader] = useState('')

    const actionCart = () => {
        if(user) {
            window.location.pathname = '/cart'
        }
        else {
            window.location.pathname = '/'
        }
    }

    useEffect(() => {
        if(loadCart) {
            if (user && Array.isArray(cart)) {
                const _CART_ = cart;
                setNumsProductCart(_CART_.length);
                const calculatedTotalAfter = _CART_.reduce((acc, item) => acc + item.total_aft, 0);
                setTotalPriceProduct(parseFloat(calculatedTotalAfter).toFixed(2));
            } else {
                setNumsProductCart([]);
                setTotalPriceProduct(0);
            }
            setLoadCart(false)
        }
    }, [loadCart]);
    

    useEffect(()=>{
        window.addEventListener('scroll', () => {
            const horizontalScrollPosition = window.scrollY;
            setYaxis(horizontalScrollPosition);
        });
        if(Yaxis >= 300 && window.location.pathname !== '/signup' && window.location.pathname !== '/display' && window.location.pathname !== '/cart' && !window.location.pathname.startsWith('/display')) {
            setStatusHeader('header-fixed')
        }
        else {
            setStatusHeader('header-static')
        }
    },[Yaxis])
    return (
        <header className={statusHeader}>
            <div className="btns">
                <button onClick={()=>setNavBar(true)}><i className="fa-solid fa-bars"></i></button>
                <button onClick={()=>setSearchBar(true)}><i className="fa-solid fa-magnifying-glass"></i></button>
            </div>
            <h1>
                <Link to='/'><Logo size="90"/></Link>
            </h1>
            <div className='cart'>
                <button onClick={actionCart} className='cartLink' to='/cart'>
                    <span style={numsProductCart > 0 ?{
                        color: "var(--success)"} : null
                        } className='total'>{totalPriceProduct || 0}</span>ر.س
                    <div className='cartIcon'>
                        <i className="fa-solid fa-cart-shopping"></i>
                        <div
                        style={numsProductCart > 0 ? {
                            backgroundColor: `var(--danger)`
                        }:null}
                        className='numsProduct'>{numsProductCart}</div>
                    </div>
                </button>
                {!user.active? 
                <button onClick={()=>setLoginBar(true)}>
                    <i className="fa-solid fa-user"></i></button>
                :
                <>
                <div className='user-area'>
                    <img 
                    onMouseMove={() => setShowUserName(true)}
                    onMouseLeave={() => setShowUserName(false)}
                    
                    src={!user.img ? require('../3.public/cusotmers/def.png') : user.img} alt='def-user'/>
                    {showUserName ? 
                    // <p className='name-of-user'>{user.fullName.split('')[0]}</p>
                    <p className='name-of-user'></p>
                    :
                    null
                    }
                </div>
                </>
                }
            </div>
        </header>
    )
}