import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

const Vocab = ({vocab}) => {
    return(
        <Card className="mt-1">
            <Card.Body>
                <Card.Title>{vocab.vocab_jp}</Card.Title>
                <Card.Subtitle>{vocab.vocab_en}</Card.Subtitle>
                <Card.Text></Card.Text>
                <Card.Text>{vocab.japanese}<br/>{vocab.english}</Card.Text>
            </Card.Body>
        </Card>
    )
}

const CardList = ({cards}) => {
    return(
        <Container className="p-3">
            <div id={'cardlist'}>
                {cards.map(card => <Row key={`card${card.index}`}><Col><Vocab vocab={card}/></Col></Row>)}
            </div>
        </Container>
    )
}

export default CardList