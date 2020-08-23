
import React from 'react'

const Start = () => {
    const token = localStorage.getItem('accessToken')
    return <div>
        {token}
    </div>
}

export default Start