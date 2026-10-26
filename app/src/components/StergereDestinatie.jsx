export default function StergereDestinatie({ onDelete }) {
    return (
        <button type="button" className="sterge" onClick={onDelete}>
            Șterge
        </button>
    )
}
