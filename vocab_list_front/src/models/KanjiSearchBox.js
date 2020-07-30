import React, { useState, useRef } from 'react'
import { Container, Row, Col, Card, Collapse, ListGroupItem, Dropdown } from 'react-bootstrap'
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

const KanjiSearchBox = ({suggestions, tags, setTags}) => {

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i))
    }

    const handleAddition = (tag) => {
        setTags([...tags, tag])
    }

    const handleDrag = (tag, curPos, newPos) => {
        const newTags = tags.slice()
        newTags.splice(curPos, 1)
        newTags.splice(newPos, 0, tag)
        setTags(newTags)
    }

    return(
        <Container id="kanji-search-box">
            <ReactTags
                tags={tags}
                suggestions={suggestions}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                delimiters={[188, 13]}
            />
        </Container>
    )
}

export default KanjiSearchBox