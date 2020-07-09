import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardList from './CardList'
import { ButtonToolbar, Button, Spinner } from 'react-bootstrap'
import { Redirect, withRouter } from 'react-router-dom'

const CardView = ({limit, offset, searchTerm}) => {
    const [cards, setCards] = useState([])
    const [newOffset, setNewOffset] = useState(-1)
    const [displaySpinner, setDisplaySpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            let uri = `https://koruru.org:3001/api/cards/${offset}&${limit}`

            if (searchTerm && searchTerm.trim()) {
                uri += `&${searchTerm.trim()}`
            }

            const result = await axios.get(uri)
            setCards(result.data)
            setDisplaySpinner(false)
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
        return <Redirect to={`/${newOffset}`} />
    }

    if (displaySpinner) {
        return <Spinner animation="grow" variant="dark" />
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

export default withRouter(CardView) 