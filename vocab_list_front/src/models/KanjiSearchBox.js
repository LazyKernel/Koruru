import React, { useState, useRef } from 'react'
import { Container, ButtonGroup, Row, Col, Card, Collapse, ListGroupItem, Dropdown } from 'react-bootstrap'
import AutoSuggest from 'react-autosuggest'
import TagsInput from 'react-tagsinput'
import { Portal } from 'react-portal'

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


    const onSuggestionSelected = (e, { suggestion }) => {
        console.log(suggestion)
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
        autoSuggestInput.current.focus()
    }


    const renderSuggestion = suggestion => {
        if (suggestion === highlightedSuggestion) {
            return (
                <ListGroupItem active={true} onClick={(e) => onSuggestionSelected(e, { suggestion })}>
                    {suggestion}
                </ListGroupItem>
            )
        }
        
           return (
            <ListGroupItem onClick={(e) => onSuggestionSelected(e, { suggestion })}>
                {suggestion}
            </ListGroupItem>
        )
    }

    const renderSuggestionsContainer = ({ containerProps, children, query }) => {
        return (
            <Dropdown show={true} {...containerProps}>
                <Dropdown.Menu show={true}>
                    {children}
                </Dropdown.Menu>
            </Dropdown>
        )
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
            renderSuggestionsContainer={renderSuggestionsContainer}
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