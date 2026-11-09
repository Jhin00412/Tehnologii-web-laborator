import { useState } from 'react'
import { valideaza } from '../utils/validareDestinatie.js'

export default function FormularDestinatie({ onAdd, seTrimite }) {
    const [valori, setValori] = useState({ oras: '', tara: '', zile: '' })
    const [erori, setErori] = useState({})

    function handleChange(event) {
        const { name, value } = event.target
        setValori((valoriCurente) => ({ ...valoriCurente, [name]: value }))
        setErori((eroriCurente) => ({ ...eroriCurente, [name]: '' }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const eroriNoi = valideaza(valori)
        setErori(eroriNoi)

        if (Object.keys(eroriNoi).length > 0) return

        const adaugata = await onAdd({
            id: crypto.randomUUID(),
            oras: valori.oras.trim(),
            tara: valori.tara.trim(),
            zile: Number(valori.zile),
            vizitat: false
        })

        if (adaugata) {
            setValori({ oras: '', tara: '', zile: '' })
            setErori({})
        }
    }

    return (
        <form className="formular" onSubmit={handleSubmit} noValidate>
            <div className="camp">
                <input
                    type="text"
                    name="oras"
                    placeholder="Oraș"
                    aria-label="Oraș"
                    aria-invalid={Boolean(erori.oras)}
                    value={valori.oras}
                    onChange={handleChange}
                    className={erori.oras ? 'invalid' : ''}
                />
                {erori.oras && <p className="eroare-camp">{erori.oras}</p>}
            </div>
            <div className="camp">
                <input
                    type="text"
                    name="tara"
                    placeholder="Țară"
                    aria-label="Țară"
                    aria-invalid={Boolean(erori.tara)}
                    value={valori.tara}
                    onChange={handleChange}
                    className={erori.tara ? 'invalid' : ''}
                />
                {erori.tara && <p className="eroare-camp">{erori.tara}</p>}
            </div>
            <div className="camp">
                <input
                    type="number"
                    name="zile"
                    placeholder="Zile"
                    aria-label="Zile"
                    min="1"
                    max="30"
                    step="1"
                    aria-invalid={Boolean(erori.zile)}
                    value={valori.zile}
                    onChange={handleChange}
                    className={erori.zile ? 'invalid' : ''}
                />
                {erori.zile && <p className="eroare-camp">{erori.zile}</p>}
            </div>
            <button type="submit" disabled={seTrimite}>
                {seTrimite ? 'Se trimite...' : 'Adaugă'}
            </button>
        </form>
    )
}
