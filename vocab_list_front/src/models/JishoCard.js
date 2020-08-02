import React, { useState } from 'react'
import { Container, Row, Col, Card, Collapse, Badge } from 'react-bootstrap'
import ReactFuri from 'react-furi'

const Word = ({ wordObj }) => {
    return <ReactFuri className="jisho-word" word={wordObj.word} reading={wordObj.reading} style={{ fontFamily: 'inherit' }} />
}

const JishoCard = ({ jishoResponse }) => {
    const [displayFooter, setDisplayFooter] = useState(false)

    const handleClick = (event) => {
        setDisplayFooter(!displayFooter)
    }

    const getBadge = () => {
        if (jishoResponse.is_common) { 
            return <Badge variant="success">Common</Badge> 
        }
    }

    const getJlpt = () => {
        if (jishoResponse.jlpt.length) { 
            return <Badge variant="info">{jishoResponse.jlpt[0].replace('-', ' ').toUpperCase()}</Badge>
        }
    }

    // TODO: add info, restrictions, see also?, other forms
    return(
        <Card className="mt-1">
            <Card.Body onClick={handleClick}>
                <Container>
                    <Row>
                        <Col xs={3} sm={2} md={2} lg={2} xl={2}>
                            {getBadge()}<br/>
                            {/* there shouldn't be multiple jlpt levels */}
                            {getJlpt()}
                        </Col>
                        <Col>
                            <Card.Title><Word wordObj={jishoResponse.japanese[0]} /></Card.Title>
                            <Card.Text></Card.Text>
                            <ol>
                                {jishoResponse.senses.map((e, i) => 
                                    <li key={`english${i}`}>
                                        {e.parts_of_speech.join(', ')}: {e.english_definitions.join(', ')}
                                    </li>)
                                }
                            </ol>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
            <Collapse in={displayFooter}>
                <div className="p-0 m-0">
                    <Card.Footer>
                        <Container className="justify-content-between">
                            <Row>
                                <Col><Card.Link href={`https://jisho.org/word/${jishoResponse.slug}`} target="_blank">Jisho</Card.Link></Col>
                                <Col className="text-muted text-right"><small><i>Slug: {jishoResponse.slug}</i></small></Col>
                            </Row>
                        </Container>
                    </Card.Footer>
                </div>
            </Collapse>
        </Card>
    )
}

export default JishoCard