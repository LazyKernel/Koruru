import React, { useState } from 'react';
import './App.css';
import CardView from './CardView';
import { Navbar, Form } from 'react-bootstrap'
import { Route, withRouter, Switch } from 'react-router-dom'

const App = () => {
  const [limit, setLimit] = useState(11)

  const handleChange = (event) => {
    setLimit(event.target.value)
  }

  return (
    <div className="container">
      <Navbar bg="dark" expand="lg" variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form variant="dark" inline>
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
