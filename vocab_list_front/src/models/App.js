import React, { useState, useEffect } from 'react'
import '../css/App.css';
import CardView from './CardView'
import SearchView from './SearchView'
import KanjiSearch from './KanjiSearch'
import { Navbar, Nav, Form, FormControl, InputGroup, Button, Container } from 'react-bootstrap'
import { Route, withRouter, Switch, NavLink } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const App = (props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchBoxValue, setSearchBoxValue] = useState('')
  const [limit, setLimit] = useState(11)
  const cookies = new Cookies()

  useEffect(() => {
    const lim = cookies.get('page-card-limit')

    if (lim === undefined) {
      cookies.set('page-card-limit', limit, { sameSite: 'strict' })
    } 
    else {
      setLimit(lim)
    }
  }, [limit, cookies])

  const handleChange = (event) => {
    cookies.set('page-card-limit', event.target.value, { sameSite: 'strict' })
    setLimit(event.target.value)
  }

  const handleSearchBoxChange = (event) => {
    setSearchBoxValue(event.target.value)
  }

  const preventSubmitHandler = (event) => {
    event.preventDefault()
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    event.target.blur()
    setSearchTerm(searchBoxValue.trim())

    if (searchBoxValue && searchBoxValue.trim()) {
      // can't or these together
      const re1 = /&(\d+)/
      const re2 = /\/(\d+)/
      const match1 = re1.exec(props.location.pathname)
      const match2 = re2.exec(props.location.pathname)

      if (!match1 && !match2) {
        props.history.push('/search/0&0')
        return
      }
      
      props.history.push(`/search/0&${match1 ? match1[1] : null || match2 ? match2[1] : null || 0}`)
    }
  }

  const clearSearch = () => {
    setSearchBoxValue('')
    setSearchTerm('')
  }

  return (
    <div className="container">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="/" onClick={clearSearch} style={{ paddingLeft: "5px" }}>
          Koruru
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={NavLink} variant="dark" exact to="/" onClick={clearSearch}>Core 2k</Nav.Link>
            <Nav.Link as={NavLink} variant="dark" exact to="/kanji" onClick={clearSearch}>Kanji Search</Nav.Link>
          </Nav>
          {/*<Form inline variant="dark" onSubmit={preventSubmitHandler}>
            <Form.Label className="text-light" htmlFor="cards_per_page">Cards per page</Form.Label>
            <Form.Control type="number" id="cards_per_page" name="cards_per_page" placeholder="Cards per page" min="1" value={limit} onChange={handleChange}></Form.Control>
          </Form>*/}
          <Container className="justify-content-end">
            <Form inline variant="dark" onSubmit={handleSearchSubmit}>
              <InputGroup>
                <FormControl type="text" placeholder="Search" onChange={handleSearchBoxChange} value={searchBoxValue} />
                <InputGroup.Append>
                  <Button variant="light" type="submit"><FontAwesomeIcon icon={faSearch} /></Button>
                </InputGroup.Append>
              </InputGroup>
            </Form>
          </Container>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path='/' render={() => <CardView limit={limit} offset={0}/>} />
        <Route exact path='/search' render={() => <SearchView limit={limit} offset={0} searchTerm={searchTerm}/>}/>
        <Route exact path='/kanji' render={() => <KanjiSearch />} />
        <Route path='/search/:offset&:prevOffset' render={(props) => <SearchView limit={limit} offset={props.match.params.offset} searchTerm={searchTerm} cardViewOffset={props.match.params.prevOffset}/>}/>
        <Route path='/:offset' render={(props) => <CardView limit={limit} offset={props.match.params.offset}/>}/>
      </Switch>
    </div>
  );
}

export default withRouter(App)
