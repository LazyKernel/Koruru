import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardList from './CardList'
import { ButtonToolbar, Button, Spinner, Container, Col, Row } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

const SearchView = ({limit, offset, searchTerm, cardViewOffset}) => {
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

    const getSpinner = () => {
        if (displaySpinner) { 
            return <Spinner animation="grow" variant="dark" /> 
        }
    }

    const getInfoMessage = () => {
        if (!searchTerm) {
            return(
                <Container className="justify-content-between p-3">
                    <Row>
                        <Col>Please enter a search term</Col>
                        <Col className="text-right"><a href={`/${cardViewOffset || 0}`}>← Back to list</a></Col>
                    </Row>
                </Container>
            )
        }
    
        if (cards.length <= 0 && !displaySpinner) {
            return(
                <Container className="justify-content-between p-3">
                    <Row>
                        <Col>No results for '<i>{searchTerm}</i>'</Col>
                        <Col className="text-right"><a href={`/${cardViewOffset || 0}`}>← Back to list</a></Col>
                    </Row>
                </Container>
            )
        }

        return(
            <>
            <Container className="justify-content-between p-3">
                <Row>
                    <Col>Results for '<i>{searchTerm}</i>'</Col>
                    <Col className="text-right"><a href={`/${cardViewOffset || 0}`}>← Back to list</a></Col>
                </Row>
            </Container>
            {getSpinner()}
            </>
        )
    }

    if (newOffset >= 0) {
        return <Redirect to={`/search/${newOffset}&${cardViewOffset}`} />
    }

    return(
        <div>
            <div>
                {getInfoMessage()}
            </div>
            <div>
                <CardList cards={cards} />
            </div>
            <ButtonToolbar style={{ paddingBottom: "20px" }} className="justify-content-between">
                <Button style={previousButtonStyle()} onClick={() => handleClick(-1)}>← Previous</Button>
                <Button style={nextButtonStyle()} onClick={() => handleClick(1)}>Next →</Button>
            </ButtonToolbar>
        </div>
    )
}

export default SearchView