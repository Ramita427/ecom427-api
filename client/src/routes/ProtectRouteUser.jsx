import React, { useState, useEffect } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentUser } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteUser = ({ children }) => {
    const [ok, setOk] = useState(null)
    const user = useEcomStore((state) => state.user)
    const token = useEcomStore((state) => state.token)

    useEffect(() => {
        if (user && token) {
            currentUser(token)
                .then((res) => setOk(true))
                .catch((err) => setOk(false))
        } else {
            setOk(false)
        }
    }, [user, token])

    if (ok === null) {
        return <div className="text-center p-10 font-bold">กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</div>
    }
    
    return ok ? children : <LoadingToRedirect />
}

export default ProtectRouteUser