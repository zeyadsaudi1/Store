import { useContext } from "react";
import Logo from "./logo";
import { Auth } from "../context/context";
import '../4.style/components/loading.css'

export default function LoadingPage() {
    const {mode} = useContext(Auth);
    return (
        <div className="loading out">
            <Logo />
        </div>
    )
}