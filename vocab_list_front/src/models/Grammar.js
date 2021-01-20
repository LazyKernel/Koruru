import React from 'react'

import { Container, Table } from 'react-bootstrap'

const verbs = [
    {
        name: '',
        ru: '',
        u: '',
        irregular: '',
        finnish: '',
        notes: ''
    },

]

const adjectives = [
    {
        name: '',
        na: '',
        i: '',
        irregular: '',
        notes: ''
    },


]

const TableRows = ({data}) => data.slice(1).map((e, i) => <tr key={i}>{Object.keys(e).map((k, idx) => <th key={`${i}${idx}`}>{e[k]}</th>)}</tr>)

const Grammar = () => {

    return (
        <>
        <Container className="mt-4">
            <h3>Verb Conjugations</h3>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ru</th>
                        <th>U</th>
                        <th>Irregular</th>
                        <th>Finnish equivalent</th>
                        <th>Example / Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <TableRows data={verbs} />
                </tbody>
            </Table>
        </Container>
        <hr></hr>
        <Container className="pt-4">
            <h3>Adjective Conjugations</h3>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Na</th>
                        <th>I</th>
                        <th>Irregular</th>
                        <th>Example / Notes</th>
                    </tr>
                </thead>
                <tbody>
                    <TableRows data={adjectives} />
                </tbody>
            </Table>
        </Container>
        </>
    )
}

export default Grammar
