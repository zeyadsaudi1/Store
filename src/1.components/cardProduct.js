import { useContext, useState } from 'react'
import '../4.style/components/card_product.css'
import { Auth } from '../context/context';
import { useNavigate } from 'react-router-dom';


export default function CardProduct(props) {
    const {API, curtains} = useContext(Auth)
    // const [getId, setGetId] = useState('')
    const navigate = useNavigate();

    return (
        <div className="card-product">
            <div onClick={() => {
                localStorage.setItem("_D_", props.id)
                window.location.pathname = `/display/${props.id}`
            }} className="bgProduct" style={{backgroundImage: `url(${props.img})`}}>
                <p className='cat'>{props.cat}</p>
            </div>
            <div className='type'>{props.type}</div>
            <h3>{props.title}</h3>
            <div className='price'>
                <span className='bef-price'>{props.bef === '' ? "0" : props.bef} ر.س</span>
                <span className='aft-price'>{props.aft} ر.س</span>
            </div>
            <button 
            onClick={() => {
                window.location.pathname = `/display/${props.id}`
            }}
            className="add-card">
                أضف الى السله <i className="fa-solid fa-cart-shopping"></i>
            </button>
            <button className="fav"><i className="fa-solid fa-heart"></i></button>
        </div>
    )
}