import StergereDestinatie from './StergereDestinatie.jsx'

export default function DestinatieCard({ destinatie, onToggleVisit, onDelete }) {
    const { oras, tara, zile, vizitat, id } = destinatie

    return (
        <article className={vizitat ? 'card vizitat' : 'card'}>
            <h3>{oras}</h3>
            <p className="tara">{tara}</p>
            <p className="zile">{zile} zile</p>
            <button
                type="button"
                onClick={() => onToggleVisit(id)}
            >
                {vizitat ? 'Vizitat' : 'Marchează vizitat'}
            </button>
            <StergereDestinatie onDelete={() => onDelete(id)} />
        </article>
    )
}