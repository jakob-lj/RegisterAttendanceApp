import React, { useState } from 'react'


const Home = () => {

    const [email, setEmail] = useState('')
    const [register, setRegister] = useState(false)
    const [fed, setFed] = useState(false)
    const [err, setErr] = useState(false)
    const [code, setCode] = useState('')

    const backend = process.env.REACT_APP_ENDPOINT

    const login = () => {
        fetch(`${backend}/doLogin`, {method: 'post', headers: {'Content-Type': 'application/JSON'}, body: JSON.stringify({email, code})}).then(r => r.json()).then(r => {
            if (r.token) {
                localStorage.setItem('accessToken', r.token)
                window.location.href="/app"
            } else {
                setErr(true)
            }
        })
    }

    const action = () => {
        let prom
        if (register) {
            prom = fetch(`${backend}/users`, {method: 'post', headers: {'Content-Type': 'Application/JSON'}, body: JSON.stringify({email})})
        } else {
            prom = fetch(`${backend}/login`, {method: 'post', headers: {'Content-Type': 'Application/JSON'}, body: JSON.stringify({email})})
        }
        prom.then(r => r.json()).then(r => {
            if (r.status === false) {
                setErr(true)
            } else {
                setFed(true)
            }
        })
    }

    if (err) {
        return <div>
            <p>Det skjedde en feil</p>
        </div>
    }

    if (fed && register) {
        return <div>
            Vi har sendt deg en e-post med videre instrukser
        </div>
    } else if (fed) {
        return <div>
            <p>Skriv inn koden du fikk tilsendt på e-post</p>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} />
            <button onClick={login}>Logg inn</button>
        </div>
    }

    return <div>
        <h2>Logg inn:</h2>
        <button onClick={(e) => setRegister(!register)}>Ny bruker? Trykk her for å registrere</button>
        <div>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={action}>{register ? 'Registrer ' : 'Logg inn'}</button>
        </div>
        
        
        
    </div>
}

export default Home