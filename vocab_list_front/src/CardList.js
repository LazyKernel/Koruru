import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import ReactFuri from 'react-furi'

const Word = ({text}) => {
    const getWord = () => {
        const re = /(.*)\[.*\]/g
        const match = re.exec(text)

        if (match !== null) {
            return match[1]
        }

        return null
    }

    const getReading = () => {
        const re = /.*\[(.*),.*\]|\[(.*);.*\]/g
        const match = re.exec(text)

        if (match !== null) {
            return match[1] || match[2]
        }

        return null
    }

    const getStyle = () => {
        const re = /(n[\d]{1,2})|(k[\d]{1,2})+?|[hanok]/g
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

    if (getReading() == null) {
        return (
            <ReactFuri.Pair>
                <span></span>
                <ReactFuri.Text style={getStyle()}>{getWord()}</ReactFuri.Text>
            </ReactFuri.Pair>
        )
    }

    return <ReactFuri word={getWord()} reading={getReading()} style={getStyle()} />
}

const Vocab = ({vocab}) => {
    return(
        <Card className="mt-1">
            <Card.Body>
                <Card.Title>{vocab.vocab_jp}</Card.Title>
                <Card.Subtitle>{vocab.vocab_en}</Card.Subtitle>
                <Card.Text></Card.Text>
                <Card.Text>{vocab.japanese.split(' ').map((word, index) => <Word key={index} text={word} />)}<br/><br/>{vocab.english}</Card.Text>
            </Card.Body>
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