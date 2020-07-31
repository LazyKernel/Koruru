import React, { useEffect, useState } from 'react'
import axios from 'axios'
import KanjiSearchBox from './KanjiSearchBox'
import { ButtonToolbar, Form, FormControl, InputGroup, Button, Spinner, Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import qs from 'qs'

const KanjiSearch = () => {
    const [terms, setTerms] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [kanjis, setKanjis] = useState([])
    const [cards, setCards] = useState([])
    const [displaySpinner, setDisplaySpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`https://koruru.org:3001/api/kanji/list`)
            setSuggestions(result.data)
            setDisplaySpinner(false)
        }

        setDisplaySpinner(true)
        fetchData()
    }, [])

    const getSpinner = () => {
        if (displaySpinner) { 
            return <Spinner animation="grow" variant="dark" /> 
        }
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        event.target.blur()
        console.log(terms)
        
        if (terms.length <= 0)
            return

        const fetchData = async () => {
            const result = await axios.get(`https://koruru.org:3001/api/kanji/search`,
                {
                    params: {
                        term: terms
                    }
                }
            )
            setKanjis(result.data)

            const combinationArrays = {}
            terms.forEach(e => {
                combinationArrays[e] = []
            })

            result.data.forEach(e => {
                if (e.meaning in combinationArrays) {
                    combinationArrays[e.meaning].push(e)
                }
            })

            var possibleJukugo = []
            for (var key in combinationArrays) {
                var copy = possibleJukugo.slice()
                possibleJukugo = []
                combinationArrays[key].forEach(e => {
                    if (copy.length <= 0) {
                        possibleJukugo.push(e.kanji)
                    }
                    else {
                        copy.forEach(c => {
                            possibleJukugo.push(c + e.kanji)
                        })
                    }
                })
            }

            const jishoResults = []
            possibleJukugo.forEach(async e => {
                const jishoRes = await axios.get(`https://koruru.org:3001/api/jisho/${e}`)
                jishoResults.push(jishoRes)
            })
            
            console.log(jishoResults)
        }

        fetchData()
      }

    return(
        <div>
            <Container className="pt-4 pb-4">
                <h3>KanjiDamage Keyword Search</h3>
                <p>Search Jukugo by writing the keywords of each individual kanji in order. Search automatically suggests possible keywords.</p>
                <KanjiSearchBox suggestions={suggestions} tags={terms} setTags={setTerms} />
                <Button className="float-right" variant="light" onClick={handleSearchSubmit}><FontAwesomeIcon icon={faSearch} /> Search</Button>
            </Container>
            <hr/>
        </div>
    )
}

export default KanjiSearch