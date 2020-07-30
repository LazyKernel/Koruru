import React, { useState, useRef } from 'react'
import { Container, Row, Col, Card, Collapse, ListGroupItem } from 'react-bootstrap'
import AutoSuggest from 'react-autosuggest'
import TagsInput from 'react-tagsinput'

const KanjiSearchBox = ({suggestions, tags, setTags}) => {

    const [autoSuggestValue, setAutoSuggestValue] = useState('')
    const [highlightedSuggestion, setHighlightedSuggestion] = useState('')
    const [localSuggestions, setLocalSuggestions] = useState([])

    const autoSuggestInput = useRef(null)

    const handleTagsChange = (value) => {
        setTags(value)
    }

    const handleSuggestChange = (e, { newValue }) => {
        setAutoSuggestValue(newValue)
    }

    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
      
        return inputLength === 0 ? [] : suggestions.filter(s =>
            s.toLowerCase().slice(0, inputLength) === inputValue
        )
    }

    const getSuggestionValue = suggestion => suggestion

    const renderSuggestion = suggestion => {
        if (suggestion === highlightedSuggestion) {
            return (
                <ListGroupItem active>
                    {suggestion}
                </ListGroupItem>
            )
        }
        
           return (
            <ListGroupItem>
                {suggestion}
            </ListGroupItem>
        )
    }

    const onSuggestionSelected = (e, {  suggestion }) => {
        setTags([...tags, suggestion])
        setAutoSuggestValue('')
    }

    const onSuggestionHighlighted = ({ suggestion }) => {
        setHighlightedSuggestion(suggestion)
    }

    const onSuggestionsFetchRequested = ({ value }) => {
        setLocalSuggestions(getSuggestions(value))
    }

    const onSuggestionsClearRequested = () => {
        setLocalSuggestions([])
    }

    const focusAutoSuggest = () => {
        console.log('called')
        autoSuggestInput.current.focus()
    }


    const inputProps = {
        placeholder: 'Type kanji keywords',
        value: autoSuggestValue,
        onChange: handleSuggestChange,
        ref: autoSuggestInput
    }

    const theme = {
        suggestionsContainer: 'list-group'
    }


    const renderAutoSuggest = () => (
        <AutoSuggest
            suggestions={localSuggestions}
            onSuggestionSelected={onSuggestionSelected}
            onSuggestionHighlighted={onSuggestionHighlighted}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
        />
    )

    return(
        <Container id="kanji-search-box" onClick={focusAutoSuggest}>
            <TagsInput renderInput={renderAutoSuggest} value={tags} onChange={handleTagsChange} />
        </Container>
    )
}

export default KanjiSearchBox