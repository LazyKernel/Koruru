import React, { useState, useEffect } from 'react';
import './App.css';
import CardView from './CardView';
import { Navbar, Form } from 'react-bootstrap'
import { Route, withRouter, Switch } from 'react-router-dom'
import Cookies from 'universal-cookie'

const App = () => {
  const [limit, setLimit] = useState(11)
  const cookies = new Cookies()

  const handleChange = (event) => {
    cookies.set('page-card-limit', event.target.value, { sameSite: 'strict' })
    setLimit(event.target.value)
  }

  useEffect(() => {
    const lim = cookies.get('page-card-limit')

    if (lim === undefined) {
      cookies.set('page-card-limit', limit, { sameSite: 'strict' })
    } 
    else {
      setLimit(lim)
    }
  }, [limit, cookies])

  return (
    <div className="container">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Brand style={{ paddingLeft: "5px" }}>
          Core 2k list
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Form inline variant="dark">
            <Form.Label className="text-light" htmlFor="cards_per_page">Cards per page</Form.Label>
            <Form.Control type="number" id="cards_per_page" name="cards_per_page" placeholder="Cards per page" min="1" value={limit} onChange={handleChange}></Form.Control>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path='/' render={() => <CardView limit={limit} offset={0}/>} />
        <Route path='/:offset' render={(props) => <CardView limit={limit} offset={props.match.params.offset}/>}/>
      </Switch>
    </div>
  );
}

export default withRouter(App);
