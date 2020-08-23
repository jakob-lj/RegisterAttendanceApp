
import React, { useState, useEffect } from 'react'

const Start = () => {
    const token = localStorage.getItem('accessToken')
    const backend = process.env.REACT_APP_ENDPOINT

    const [keys, setKeys] = useState(null)
    const [showInp, setShowInp] = useState(false)
    const [tokenName, setTokenName] = useState('Token')

    const generate = () => {
        fetch(`${backend}/apiKeys?token=${token}`, {method: 'post', headers: {'Content-Type':'Application/JSON'}, body: JSON.stringify({name: tokenName})}).then(r => r.json).then(r => {
            console.log(r)
        })
    }

    useEffect(() => {
        fetch(`${backend}/apiKeys?token=${token}`).then(r => r.json()).then(r => {
            setKeys(r.rows)
        })
    }, [])

    if (keys === null) {
        return <div>
            
            loading...
        </div>
    }

    const rowResult = keys.map(key => {
        return <tr key={key.token}><td>{key.name}</td><td>{key.token}</td><td>{key.generatedat}</td></tr>
    })

    return <div>
        {!showInp && <button onClick={(e) => setShowInp(!showInp)}>Add new key</button>}
        {showInp && <p>Name of key:</p>}
        {showInp && <input value={tokenName} onChange={(e) => setTokenName(e.target.value)} type="text" placeholder="name" />}
        {showInp && <button onClick={generate}>Generate key</button>}
            <table style={{width: '50%'}}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Token</td>
                        <td>Generated at</td>
                    </tr>
                </thead>
                <tbody>
                    {rowResult}
                </tbody>
            </table>
    </div>
}

export default Start