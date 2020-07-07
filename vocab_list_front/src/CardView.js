import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CardList from './CardList'

const CardView = () => {
    const [cards, setCards] = useState([])
    const [limit, setLimit] = useState(11)
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(`http://localhost:3001/api/cards/${offset}&${limit}`)
            setCards(result.data)
        }

        fetchData()
    }, [limit, offset])

    return(
        <div>
            <CardList cards={cards} />
        </div>
    )
}

export default CardView 