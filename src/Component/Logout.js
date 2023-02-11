import React, {useEffect} from "react";

const Logout = () => {
    useEffect(() => {
        sessionStorage.clear()
        window.location.href = "/login"
    }, [])
    return (
        <div>
            
        </div>
    )
}

export default Logout