import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../../context/context";
import CardProduct from "../../1.components/cardProduct";
import '../../4.style/components2/sub.css'

export default function Role() {
    const { curtains } = useContext(Auth)
    const [selector,setSelector] = useState("all")
    const [path,setPath] = useState('')

    const navigate = useNavigate()

    useEffect(()=>{
        if(selector === 'sun_screen') {
            setPath('صن اسكرين')
        }
        else if(selector === 'black_out') {
            setPath('بلاك اوت')
        }
        else if(selector === 'all') {
            setPath('')
        }
        else {
            navigate('/')
        }
    },[selector])

    return (
        <div className="sub_page">
            <div className="head">
                <h2>ستائر الرول</h2>
                <p><Link to='/'>الرئيسية</Link> / <Link onClick={()=> setSelector('all')} className={selector === 'all' ? 
                "current" : null
                }>ستائر رول</Link> {path?'/'+path:null}</p>
                <div className="sunscreen-blacout">
                    <button className={selector === "sun_screen" ? "current" : null} onClick={() => {
                        setSelector("sun_screen")
                    }}>صن اسكرين</button>
                    <button 
                    className={selector === "black_out" ? "current" : null}
                    onClick={()=>{
                    setSelector("black_out")
                    }}>بلاك اوت</button>
                </div>
            </div>
            <div className="container">
                {selector === 'all' ? curtains.map((e,i) => 
                    <CardProduct
                    key={i}
                    id={e._id}
                    aft={e.aft_price_per_meter}
                    bef={e.bef_price_per_meter}
                    img={e.subPhoto}
                    cat={e.category}
                    title={e.title}
                    type={e.type}
                />
                ) : 
                curtains.filter((e) => e.category === path).map((el) => 
                <CardProduct
                    id={el._id}
                    aft={el.aft_price_per_meter}
                    bef={el.bef_price_per_meter}
                    img={el.subPhoto}
                    cat={el.category}
                    title={el.title}
                    type={el.type}
                />
                )
                }
            </div>
        </div>
    )
}