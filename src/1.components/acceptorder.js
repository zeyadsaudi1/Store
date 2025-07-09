import { useContext } from "react";
import Logo from "./logo";
import { Auth } from "../context/context";
import '../4.style/components/acceptorder.css'

export default function DoneOrder() {
    const {mode} = useContext(Auth)
    return (
        <div className="doneOrder">
            <div className="box">
                {mode === 'dark' ?
                <img src={require("../3.public/logo/1.png")} />
                :
                <Logo size={"250"}/>
                }
                <h1>تم ارسال طلبك بنجاح</h1>
                <p>شكرا للتعامل مع ويفي طلبك سوف يصلك في اسرع وقت</p>
                <div>
                    <img src={require("../3.public/gifs/darkscuccss.gif")} />
                </div>
            </div>
        </div>
    )
}