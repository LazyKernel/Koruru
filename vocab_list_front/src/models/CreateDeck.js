import React, { useState } from 'react'
import axios from 'axios'
import { Container, Button, Form, Spinner } from 'react-bootstrap'

const CreateDeck = () => {
    const [name, setName] = useState('')
    const [response, setResponse] = useState({id: '', name: ''})
    const [displaySpinner, setDisplaySpinner] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisplaySpinner(true)
        
        const response = await axios.post('https://koruru.org:3001/api/collab/decks', {name: name})
        setResponse(response)
        setDisplaySpinner(false)
    }

    const getToken = () => {
        if (displaySpinner) {
            return <Spinner animation="grow" variant="dark" />
        }

        if (response.name.length > 0) {
            return <p>Token for deck {response.name}: {response.id}</p>
        }
    }

    return(
        <Container className="mt-4">
            <Form inline onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label className="pr-3">Deck Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter deck name" value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">Get Token</Button>
            </Form>
            <Container className="mt-4">
                {getToken()}
            </Container>
        </Container>
    )
}

export default CreateDeck