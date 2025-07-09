import { createContext, useEffect, useState } from "react"

export const Auth = createContext();

export default function Context({children}) {
    // https://server-apiwavy.vercel.app
    const [API, setAPI] = useState('http://localhost:5000')
    const [email,setEmail] = useState('');
    const [mode, setMode] = useState('')
    const [searchBar,setSearchBar] = useState(false);
    const [navBar,setNavBar] = useState(false);
    const [cart,setCart] = useState([])
    const [loadCart,setLoadCart] = useState(false)
    const [loignBar,setLoginBar] = useState(false)
    const [checked,setChecked] = useState(false)
    const [user,setUser] = useState([])
    const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
    const [firstname, setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [emailResginster, setEmailResgister] = useState('');
    const [fullAdress,setFullAddress] = useState('');
    const [username,setUserName] = useState('')
    const [gender,setGender] = useState('male');
    const [password,setPassword] = useState('');
    const [userImage, setUserImage] = useState(null);
    const [phone, setPhone] = useState('');
    const [loading,setLoading] = useState(false)
    const [curtains,setCurtains] = useState([])
    const [loading2,setLaading2] = useState(false)
    const [showImg,setShowIMg] = useState('')

    const [productName, setProductName] = useState('')
    const [befPrice, setBefPrice] = useState('')
    const [aftPrice, setAftPrice] = useState('')
    const [type, setType] = useState('')
    const [percentageType, setPercentageType] = useState('')
    const [percentage, setPercentage] = useState('')
    const [pattern, setPattern] = useState('')
    const [warranty, setWarranty] = useState('')
    const [recomment, setRecomment] = useState('')
    const [exacFrom, setExacFrom] = useState('')
    const [exacTo, setExacTo] = useState('')
    const [disc, setDisc] = useState('')
    const [offer, setOffer] = useState('')
    const [category, setCategory] = useState('')
    const [imgProduct, setImgProduct] = useState(null)
    const [imgProduct1, setImgProduct1] = useState(null)
    const [imgProduct2, setImgProduct2] = useState(null)
    const [imgProduct3, setImgProduct3] = useState(null)
    const [imgProduct4, setImgProduct4] = useState(null)
    const [desc,setDesc] = useState('')
    const [isEdit, setIsEdit] = useState(false)
    const [idEdit, setIdEdit] = useState('');
    const [totalPriceProduct,setTotalPriceProduct] = useState(0)
    const [numsProductCart,setNumsProductCart] = useState("")
    const [loadingMain,setLoadingMain] = useState(false) 
    const [urluser,setUrluser] = useState()
    const [orders,setOrders] = useState([]);
    const [loadingusers,setLoadingusers] = useState(false)
    const [userss,setUsers] = useState([])
    const [tamarapopup, setTamaraPopup] = useState(false)


    useEffect(()=>{
        fetch(`${API}/get-curtains`, {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            }
        }).then((res)=> {
            if(res.ok) {
                return res.json()
            }
            else if(res.status === 404) {
                return null
            }
        }).then((result) => {
            setCurtains(result.data)
            setLaading2(true)
        })
        .catch((err) => {
            window.location.reload()
            console.log("not found or server error")
        });
    },[API, curtains])

    useEffect(()=>{
        fetch(`${API}/isLogged2`, {
            method: "GET",
            credentials: 'include',
            headers: {
                "Content-Type":"application/json",
            },
        }).then((res) => {
            if(res.status === 200) {
                return res.json()
            }
            else if(res.status === 400) {
                // console.clear();
                setLoading(true)
                return null;
            }
        }).then((result) => {
            result !== undefined && setUser(result.data)
            setLoading(true)
            return null
        }).catch((err)=> console.error('server conncection error!'))
    },[API])

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        setMode(savedTheme);
    }, []);


    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await fetch(`${API}/get-cart`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", 
                });
                if (response.ok) { 
                    const result = await response.json();
                    setCart(result.data); // تحديث السلة عند نجاح الطلب
                } else {
                    console.error("Failed to fetch cart:", response.status);
                }
                setLoadCart(true)
            } catch (error) {
                window.location.reload()
                console.error("Error fetching cart:", error);
            }
        };
        getCart();
    }, []);

    useEffect(() => {
        if(loading2 && loadCart && loading) {
            setTimeout(() => {
                setLoadingMain(true)
            }, 2000);
        }
    }, [loadingMain, loading2, loading, loadCart])    
    const parent = {
        API,
        searchBar,
        setSearchBar,
        navBar,
        setNavBar,
        mode, setMode,
        loignBar,
        setLoginBar,
        email,
        setEmail,
        checked,
        setChecked,
        user,
        loading,
        showTermsAndConditions, 
        setShowTermsAndConditions,
        firstname, 
        setFirstName,
        lastName,
        setLastName,
        emailResginster, 
        setEmailResgister,
        fullAdress,
        setFullAddress,
        username,
        setUserName,
        gender,
        setGender,
        password,setPassword,
        phone, setPhone,
        userImage, setUserImage,
        loading2,curtains,
        showImg,setShowIMg,
        productName,
        setProductName,
        befPrice,
        setBefPrice,
        aftPrice,
        setAftPrice,
        type,
        setType,
        percentageType,
        setPercentageType,
        percentage,
        setPercentage,
        pattern,
        setPattern,
        warranty,
        setWarranty,
        recomment,
        setRecomment,
        exacFrom,
        setExacFrom,
        exacTo,
        setExacTo,
        disc, setDisc,
        offer, setOffer,
        category,
        setCategory,
        imgProduct,
        setImgProduct,
        isEdit, setIsEdit,
        idEdit, setIdEdit,
        imgProduct1, setImgProduct1,
        imgProduct2, setImgProduct2,
        imgProduct3, setImgProduct3,
        imgProduct4, setImgProduct4,
        cart,
        loadCart,
        setLoadCart,
        totalPriceProduct,
        setTotalPriceProduct,
        numsProductCart,
        setNumsProductCart,
        loadingMain,
        setLoadingMain,
        urluser,setUrluser,
        orders,setOrders,
        loadingusers,setLoadingusers,
        userss,setUsers,
        tamarapopup, setTamaraPopup,
        desc,setDesc
    }

    return <Auth.Provider value={parent}>{children}</Auth.Provider>
}