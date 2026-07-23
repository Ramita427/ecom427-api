import React, { useState, useEffect } from 'react'
import useEcomStore from '../store/ecom-store'
import { currentAdmin } from '../api/auth'
import LoadingToRedirect from './LoadingToRedirect'

const ProtectRouteAdmin = ({ children }) => {
    const [ok, setOk] = useState(false) 

    const token = useEcomStore((state) => state.token) 

    useEffect(() => {
        if (token) {
            currentAdmin(token)
                .then((res) => {
                    console.log('Admin Access Granted')
                    setOk(true)
                })
                .catch((err) => {
                    console.log('Admin Access Denied:', err)
                    setOk(false)
                })
        } else {
            setOk(false)
        }
    }, [token])

    return ok ? children : <LoadingToRedirect />
}

export default ProtectRouteAdmin