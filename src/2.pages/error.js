import { useContext } from 'react'
import { Auth } from '../context/context'
import Logo from '../1.components/logo'
import { Link } from 'react-router-dom'
import '../4.style/page/error.css'

export default function Error() {
    const {mode} = useContext(Auth)
    return (
        <div className="error-page">
            {mode !== 'dark' ? 
            <Logo size="300" />
            :
            <img width='320' src={require('../3.public/logo/1.png')} alt='logo-wavy'></img>
            }
            <h2>لا يوجد هذه الصفحة خطأ 404</h2>
            <p>يرجى إعادة المحاولة لاحقا و الألتزام بشروط و القوانين</p>
            <Link to='/'>الرجوع للصفحة الرئيسية</Link>
        </div>
    )
}