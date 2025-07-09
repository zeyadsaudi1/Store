import { useContext, useEffect, useState } from "react"
import { Auth } from "../context/context"
import '../4.style/components2/tableProduct.css'

export default function TableProduct() {
    const {curtains,showImg,setShowIMg,
        setProductName,
        setBefPrice,
        setAftPrice,
        setType,
        setPercentageType,
        setPercentage,
        setPattern,
        setWarranty,
        setRecomment,
        setExacFrom,
        setExacTo,
        setDisc,
        setOffer,
        setCategory,
        // setImgProduct,
        setDesc,
        setIsEdit,
        setIdEdit,
        API,
    } = useContext(Auth)
    const getImg = (path) => {
        setShowIMg(path)
    }

    const [loading,setLoading] = useState(false)

    const editing = (id) => {
        const get = curtains.find((e) => e._id === id);
        console.log(get)
        setIdEdit(id)
        // const getDiscountedPrice = (discount) => {
        //     if (!discount) return 0;
        //     const discountStr = String(discount);
        //     if (!Number.isInteger(discountStr)) {
        //         return(discountStr * 100 + "%")
        //     }
        //     return discountStr
        // };
        
        setProductName(get.title)
        setBefPrice(get.bef_price_per_meter)
        setAftPrice(get.aft_price_per_meter)
        setType(get.type)
        setPercentageType(get.percentage_tpye)
        setPercentage(get.percentage)
        setPattern(get.pattern)
        setWarranty(get.warranty)
        setRecomment(get.recomment)
        setExacFrom(get.exec_from)
        setExacTo(get.exec_to)
        setDisc(get.discount)
        setCategory(get.category)
        setOffer(get.offers)
        setCategory(get.category)
        setDesc(get.desc)
    }

    const delProd = (id) => {
        setLoading(true)
        fetch(`${API}/del-product`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({id:id}),
        }).then((res)=> {
            if(res.ok) {
                setLoading(false)
                window.location.reload()
            }
            else {
                setLoading(false)
                console.error("has error!");
            }
        })
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>اسم المنتج</th>
                    <th>سعر المتر عند الشراء</th>
                    <th>سعر المتر عند البيع</th>
                    <th>النوع</th>
                    <th>الصنف</th>
                    <th>اللون</th>
                    <th>الخصم</th>
                    <th>أجمالي سعر المنتج</th>
                    <th>الأجراء</th>
                </tr>
            </thead>
            <tbody>
                {curtains.map((e) => {
                return (
                    <tr key={e.title}>
                        <td>{e.title}</td>
                        <td>{e.bef_price_per_meter} ريال</td>
                        <td>{e.aft_price_per_meter} ريال</td>
                        <td>{e.type}</td>
                        <td>{e.category}</td>
                        <td>{e.color || 'غير معروفة'}</td>
                        <td>{Number.isInteger(e.discount) ? e.discount : e.discount * 100 + "%"}</td>
                        <td>{e.last_total} ريال سعودي</td>
                        <td className="actions">
                            <button onClick={()=> getImg(e.imgsUrl[0])}>عرض</button>
                            <button onClick={() => {
                                editing(e._id)
                                setIsEdit(true)
                            }}>تعديل</button>
                            <button disabled={loading} onClick={() => delProd(e._id)}>
                                {loading ? "جار الحذف..." : "حذف"}
                            </button>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </table>
    )
}