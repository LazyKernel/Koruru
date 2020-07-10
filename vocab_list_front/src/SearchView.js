import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardList from './CardList'
import { ButtonToolbar, Button, Spinner, Alert } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

const SearchView = ({limit, offset, searchTerm}) => {
    const [cards, setCards] = useState([])
    const [newOffset, setNewOffset] = useState(-1)
    const [displaySpinner, setDisplaySpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (searchTerm) {
                const result = await axios.get(`https://koruru.org:3001/api/cards/search/${offset}&${limit}&${searchTerm.trim()}`)
                setCards(result.data)
                setDisplaySpinner(false)
            }
        }

        setDisplaySpinner(true)
        fetchData()
        setNewOffset(-1)
    }, [limit, offset, searchTerm])

    const handleClick = (multiplier) => {
        let nOffset = parseInt(offset) + (parseInt(limit) * parseInt(multiplier))
        if (nOffset < 0) {
            nOffset = 0
        }
        setNewOffset(nOffset)
    }

    const previousButtonStyle = () => {
        let style = { visibility: 'hidden' }
        if (offset > 0) {
            style.visibility = 'visible'
        }
        return style
    }

    const nextButtonStyle = () => {
        let style = { visibility: 'hidden' }
        // Probably ok to just use hard coded value here so we don't have to 
        // do a count(*) or make a table with aggregated data since the data in db
        // pretty much never changes at the moment.
        // Checking cards.length is a very bad way of not showing the next button but ehh, who cares
        // eslint-disable-next-line
        if (offset < 2006 && cards.length == limit) {
            style.visibility = 'visible'
        }
        return style
    }

    if (newOffset >= 0) {
        return <Redirect to={`/search/${newOffset}`} />
    }

    if (!searchTerm) {
        return <Alert variant="danger">Please enter a search term</Alert>
    }

    if (displaySpinner) {
        return <Spinner animation="grow" variant="dark" />
    } 

    if (cards.length <= 0) {
        return <Alert variant="info">No results for '<i>{searchTerm}</i>'</Alert>
    }

    return(
        <>
        <div>
            <CardList cards={cards} />
        </div>
        <ButtonToolbar style={{ paddingBottom: "20px" }} className="justify-content-between">
            <Button style={previousButtonStyle()} onClick={() => handleClick(-1)}>← Previous</Button>
            <Button style={nextButtonStyle()} onClick={() => handleClick(1)}>Next →</Button>
        </ButtonToolbar>
        </>
    )
}

export default SearchView