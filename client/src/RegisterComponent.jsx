import React, {useState} from 'react'

const RegisterComponent = ({match}) => {
    const {id, token, jwtToken} = match.params
    const [name, setName] = useState("")

    localStorage.setItem('accessToken', jwtToken)

    const register = () => {
        const backend = process.env.REACT_APP_ENDPOINT
        fetch(`${backend}/register/${id}?token=${token}`, {method: 'post', headers: {'Content-Type':'Application/JSON'}, body: JSON.stringify({name})}).then(r => r.json()).then(r => {
            window.location.href = '/app'
        })
    }

    return <div>
        <h1>Fullfør registrering</h1>
        <h4>Navn</h4>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={register}>Save</button>
    </div>
}

export default RegisterComponent