import React, { useState, useRef } from 'react'
import { Container, ListGroupItem, Dropdown } from 'react-bootstrap'
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


    const onSuggestionSelected = (e, { suggestion }) => {
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

    const shouldRenderSuggestions = (value) => {
        const suggestions = getSuggestions(value)
        return suggestions.length <= 10 || suggestions.includes(value)
    }


    const renderSuggestion = suggestion => {
        if (suggestion === highlightedSuggestion) {
            return (
                <ListGroupItem active={true}>
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

    const renderSuggestionsContainer = ({ containerProps, children, query }) => {
        // sorting the array in place, react needs assignment
        // eslint-disable-next-line 
        const c = children?.props.items.sort((a, b) => {
            const aShort = a.replace(query, '')
            const bShort = b.replace(query, '')
            return aShort.length - bShort.length
        })
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
            shouldRenderSuggestions={shouldRenderSuggestions}
            inputProps={inputProps}
            highlightFirstSuggestion={true}
        />
    )

    return(
        <Container id="kanji-search-box" onClick={focusAutoSuggest}>
            <TagsInput renderInput={renderAutoSuggest} value={tags} onChange={handleTagsChange} />
        </Container>
    )
}

export default KanjiSearchBox