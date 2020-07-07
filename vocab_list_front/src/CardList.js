import React from 'react'

const Card = ({card}) => {
    return(
        <div>
            <div className={'vocab'}>{card.vocab_jp} {card.vocab_en}</div>
            <div className={'sentence'}>{card.japanese} {card.english}</div>
        </div>
    )
}

const CardList = ({cards}) => {
    return(
        <div id={'cardlist'}>
            {cards.map(card => <Card key={`card${card.index}`} card={card}/>)}
        </div>
    )
}

export default CardList