import React, { useEffect, useState } from 'react'
import axios from 'axios'
import KanjiSearchBox from './KanjiSearchBox'
import { ButtonToolbar, Form, FormControl, InputGroup, Button, Spinner, Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const KanjiSearch = () => {
    const [terms, setTerms] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [cards, setCards] = useState([])
    const [displaySpinner, setDisplaySpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`https://koruru.org:3001/api/kanji/search`)
            console.log(result)
            setSuggestions(result.data.map((v, i) => { return { id: i + '', text: v }}))
            setDisplaySpinner(false)
        }

        setDisplaySpinner(true)
        fetchData()
    }, [])

    const getSearchBox = () => {
        if (displaySpinner) { 
            return <Spinner animation="grow" variant="dark" /> 
        }
        else {
            return (
                <>
                    <KanjiSearchBox suggestions={suggestions} tags={terms} setTags={setTerms} />
                    <Button className="float-right" variant="light" type="submit"><FontAwesomeIcon icon={faSearch} /> Search</Button>
                </>
            )
        }
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        event.target.blur()
        //setSearchTerm(searchBoxValue.trim())
    
        /*if (searchBoxValue && searchBoxValue.trim()) {
          // can't or these together
          const re1 = /&(\d+)/
          const re2 = /\/(\d+)/
          const match1 = re1.exec(props.location.pathname)
          const match2 = re2.exec(props.location.pathname)
    
          if (!match1 && !match2) {
            props.history.push('/search/0&0')
            return
          }
          
          props.history.push(`/search/0&${match1 ? match1[1] : null || match2 ? match2[1] : null || 0}`)
        }*/
      }

    return(
        <div>
            <Container className="pt-3 pb-3">
                <Form variant="dark" onSubmit={handleSearchSubmit}>
                    <h3>KanjiDamage Keyword Search</h3>
                    <p>Search Jukugo by writing the keywords of each individual kanji in order. Search automatically suggests possible keywords.</p>
                    {getSearchBox()}
                </Form>
            </Container>
        </div>
    )
}

export default KanjiSearch