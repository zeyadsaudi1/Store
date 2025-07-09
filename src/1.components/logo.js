import { useContext } from 'react'
import { Auth } from '../context/context'

export default function Logo(props) {
    const {mode} = useContext(Auth)
    return (
        <>
        {mode === 'dark' ?
        <img width={props.size} src={require('../3.public/logo/1.png')} alt="logo"/>
        :
        <img width={props.size} src={require('../3.public/logo/1.png')} alt="logo"/>
        }
        </>
    )
}