import React, { useState } from 'react'
import { Container, Row, Col, Card, Collapse } from 'react-bootstrap'
import ReactFuri from 'react-furi'

const Word = ({text}) => {
    const getWordArray = () => {
        const re = /(.*)\[.*\](.*)|(.*)/g
        const match = re.exec(text)

        if (match !== null) {
            return match
        }

        return null
    }

    const getReading = (extra) => {
        const re = /\[(.*),.*;(?:.*,)+.*\]|\[(.*);(?:.*,)+.*\]|\[(.*),.*\]|\[(.*);.*\]/
        const match = re.exec(text)

        if (match !== null) {
            return (match[1] || match[2] || match[3] || match[4]) + extra
        }

        return null
    }

    const getStyle = () => {
        const re = /(n[\d]{1,2})|(k[\d]{1,2})+?|[hanok]/
        const match = re.exec(text)

        if (match) {
            switch (match[0][0]) {
                case "h":
                    return { color: '#579aff', fontFamily: 'inherit' }
                case "a":
                    return { color: '#ff5757', fontFamily: 'inherit' }
                case "n":
                    return { color: '#ffbb57', fontFamily: 'inherit' }
                case "o":
                    return { color: '#19ff66', fontFamily: 'inherit' }
                case "k":
                    return { color: '#d457ff', fontFamily: 'inherit' }
                default:
                    return {}
            }
        }
        
        return {}
    }

    const wordArray = getWordArray()
    const word = wordArray[1] + wordArray[2] || wordArray[3]
    let reading = null

    if (wordArray !== null) {
        reading = getReading(wordArray[2])
    }

    if (reading === null) {
        return (
            <ReactFuri.Pair>
                <span></span>
                <ReactFuri.Text style={getStyle()}>{word}</ReactFuri.Text>
            </ReactFuri.Pair>
        )
    }

    return <ReactFuri word={word} reading={reading} style={getStyle()} />
}

const Vocab = ({vocab}) => {
    const [displayFooter, setDisplayFooter] = useState(false)

    const getCleanWord = () => {
        return vocab.vocab_jp.replace(/\[.*\]/, '')
    }

    const handleClick = (event) => {
        setDisplayFooter(!displayFooter)
    }

    return(
        <Card className="mt-1">
            <Card.Body onClick={handleClick}>
                <Card.Title>{vocab.vocab_jp}</Card.Title>
                <Card.Subtitle>{vocab.vocab_en}</Card.Subtitle>
                <Card.Text></Card.Text>
                <Card.Text>{vocab.japanese.split(' ').map((word, index) => <Word key={index} text={word} />)}<br/><br/>{vocab.english}</Card.Text>
            </Card.Body>
            <Collapse in={displayFooter}>
                <div className="p-0 m-0">
                    <Card.Footer>
                        <Container className="justify-content-between">
                            <Row>
                                <Col><Card.Link href={`https://jisho.org/search/${getCleanWord()}`} target="_blank">Jisho</Card.Link></Col>
                                <Col className="text-muted text-right"><small><i>Id: {vocab.index}</i></small></Col>
                            </Row>
                        </Container>
                    </Card.Footer>
                </div>
            </Collapse>
        </Card>
    )
}

const CardList = ({cards}) => {
    return(
        <Container id="card-list" className="p-3">
            <div id={'cardlist'}>
                {cards.map(card => <Row key={`card${card.index}`}><Col><Vocab vocab={card}/></Col></Row>)}
            </div>
        </Container>
    )
}

export default CardList