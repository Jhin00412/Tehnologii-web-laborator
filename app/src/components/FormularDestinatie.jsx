import { useState } from 'react'

export default function FormularDestinatie({ onAdd }) {
    const [oras, setOras] = useState('')
    const [tara, setTara] = useState('')
    const [zile, setZile] = useState('')

    function handleSubmit(event) {
        event.preventDefault()

        const orasCompletat = oras.trim()
        const taraCompletata = tara.trim()
        const numarZile = Number(zile)

        if (
            !orasCompletat ||
            !taraCompletata ||
            !Number.isInteger(numarZile) ||
            numarZile < 1
        ) {
            return
        }

        onAdd({
            id: crypto.randomUUID(),
            oras: orasCompletat,
            tara: taraCompletata,
            zile: Number(zile),
            vizitat: false
        })

        setOras('')
        setTara('')
        setZile('')
    }

    return (
        <form className="formular" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Oraș"
                aria-label="Oraș"
                value={oras}
                onChange={(event) => setOras(event.target.value)}
            />
            <input
                type="text"
                placeholder="Țară"
                aria-label="Țară"
                value={tara}
                onChange={(event) => setTara(event.target.value)}
            />
            <input
                type="number"
                placeholder="Zile"
                aria-label="Zile"
                min="1"
                step="1"
                value={zile}
                onChange={(event) => setZile(event.target.value)}
            />
            <button type="submit">Adaugă</button>
        </form>
    )
}
