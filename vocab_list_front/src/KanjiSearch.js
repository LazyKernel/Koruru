import React, { useEffect, useState } from 'react'
import axios from 'axios'
import KanjiSearchBox from './KanjiSearchBox'
import { ButtonToolbar, Button, Spinner, Container, Col, Row } from 'react-bootstrap'

const KanjiSearch = () => {
    const [terms, setTerms] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [cards, setCards] = useState([])
    const [displaySpinner, setDisplaySpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!suggestions.length) {
                const result = await axios.get(`https://koruru.org:3001/api/kanji/search`)
                console.log(result)
                setSuggestions(result.data)
                setDisplaySpinner(false)
            }
        }

        setDisplaySpinner(true)
        fetchData()
    }, [suggestions])

    const getSpinner = () => {
        if (displaySpinner) { 
            return <Spinner animation="grow" variant="dark" /> 
        }
    }

    return(
        <div>
            <div>
                <KanjiSearchBox suggestions={suggestions} tags={terms} setTags={setTerms} />
            </div>
        </div>
    )
}

export default KanjiSearch