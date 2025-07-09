import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "../../context/context";
import CardProduct from "../../1.components/cardProduct";
import '../../4.style/components2/sub.css'

export default function Zebra() {
    const { curtains } = useContext(Auth)
    const navigate = useNavigate()
    const [selector, setSelector] = useState('')

    return (
        <div className="sub_page">
            <div className="head">
                <h2>ستائر الزيبرا</h2>
                <p><Link to='/'>الرئيسية</Link> / <Link onClick={()=> setSelector('all')} className={"current"}>ستائر الزيبرا</Link></p>
                
            </div>
            <div className="container">
                {curtains.filter((e) => e.type === "ستائر زيبرا").map((el,i) => 
                <CardProduct
                    key={i}
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