import React, { useState, useEffect } from 'react';
import './App.css';
import CardView from './CardView';
import { Navbar, Form, FormControl, InputGroup, Button } from 'react-bootstrap'
import { Route, withRouter, Switch } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const App = () => {
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
    setSearchTerm(searchBoxValue)
  }

  const clearSearch = () => {
    setSearchBoxValue('')
    setSearchTerm('')
  }

  return (
    <div className="container">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand href="#" onClick={clearSearch} style={{ paddingLeft: "5px" }}>
          Core 2k list
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Form inline variant="dark" onSubmit={preventSubmitHandler}>
            <Form.Label className="text-light" htmlFor="cards_per_page">Cards per page</Form.Label>
            <Form.Control type="number" id="cards_per_page" name="cards_per_page" placeholder="Cards per page" min="1" value={limit} onChange={handleChange}></Form.Control>
          </Form>
          <Form inline variant="dark" onSubmit={handleSearchSubmit}>
            <InputGroup>
              <FormControl type="text" placeholder="Search" onChange={handleSearchBoxChange} />
              <InputGroup.Append>
                <Button variant="light"><FontAwesomeIcon icon={faSearch} /></Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path='/' render={() => <CardView limit={limit} offset={0} searchTerm={searchTerm}/>} />
        <Route path='/:offset' render={(props) => <CardView limit={limit} offset={props.match.params.offset} searchTerm={searchTerm}/>}/>
      </Switch>
    </div>
  );
}

export default withRouter(App);
