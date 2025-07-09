import { useContext, useState } from 'react'
import '../4.style/components/searchBar.css'
import { Auth } from '../context/context'
export default function SearchBar() {
    const {setSearchBar,curtains} = useContext(Auth)
    const [searchInput,setSearchInput] = useState("");
    return (
        <div className='search-bar'>
            <button onClick={()=>setSearchBar(false)} className='close'>X</button>
            <div className='search'>
                <h2>ابحث من هنا</h2>
                <input onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} type='text' placeholder='ابحث عن كل الستائر من ويفي' />
                {curtains.filter((e)=>e.title.includes(searchInput) && searchInput !== "").slice(0,3).map((e,i)=>
                <ul key={i}>
                    <li onClick={() => {
                        window.location.pathname = `/display/${e._id}`;
                        setSearchBar(false)
                    }}>{e.title} <div className='img' style={{backgroundImage: `url(${e.imgsUrl[0]})`}}></div></li>
                </ul>
                )}
            </div>
        </div>
    )
}