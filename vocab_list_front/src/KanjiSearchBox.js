import React, { useState } from 'react'
import { Container, Row, Col, Card, Collapse } from 'react-bootstrap'
import TagsInput from 'react-tagsinput'

const KanjiSearchBox = ({suggestions, tags, setTags}) => {
    const handleChange = (tags) => {
        setTags(tags)
    }

    return(
        <Container id="kanji-search-box">
            <TagsInput value={tags} onChange={handleChange} />
        </Container>
    )
}

export default KanjiSearchBox