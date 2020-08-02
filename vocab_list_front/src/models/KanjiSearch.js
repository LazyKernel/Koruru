import React, { useEffect, useState } from 'react'
import axios from 'axios'
import KanjiSearchBox from './KanjiSearchBox'
import JishoCard from './JishoCard'
import { Button, Spinner, Container, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const KanjiSearch = () => {
    const [terms, setTerms] = useState([])
    const [suggestions, setSuggestions] = useState([])
    const [jishoEntries, setJishoEntries] = useState([])
    const [displaySpinner, setDisplaySpinner] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`https://koruru.org:3001/api/kanji/list`)
            setSuggestions(result.data)
        }

        fetchData()
    }, [])

    const getSpinner = () => {
        if (displaySpinner) { 
            return <Spinner animation="grow" variant="dark" /> 
        }
    }

    const getCardList = () => {
        console.log('entries', jishoEntries)
        console.log('map', jishoEntries.map(card => card.slug))
        return (
            <Container id="jisho-list" className="p-3">
                {jishoEntries.map(card => <Row key={`card${card.slug}`}><Col><JishoCard jishoResponse={card}/></Col></Row>)}
            </Container>
        )
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        event.target.blur()
        
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
                const data = jishoRes.data.data.filter(v => v.attribution.jmdict || v.attribution.jmnedict)
                jishoResults.push(...data)
            })
            
            setDisplaySpinner(false)
            setJishoEntries(jishoResults)
        }

        setDisplaySpinner(true)
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
            {getCardList()}
            {getSpinner()}
        </div>
    )
}

export default KanjiSearch