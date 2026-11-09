import { useEffect, useState } from 'react'

export default function PanouStatistici() {
    const [destinatii, setDestinatii] = useState([])
    const [incarcare, setIncarcare] = useState(true)
    const [eroare, setEroare] = useState('')
    const [prag, setPrag] = useState('3')

    useEffect(() => {
        const controller = new AbortController()

        async function incarca() {
            try {
                const response = await fetch(
                    'http://localhost:3001/destinatii',
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error(`Serverul a răspuns cu ${response.status}`)
                }

                const date = await response.json()
                setDestinatii(date)
            } catch (error) {
                if (!controller.signal.aborted) {
                    setEroare(error.message)
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIncarcare(false)
                }
            }
        }

        incarca()

        return () => controller.abort()
    }, [])

    if (incarcare) {
        return <p className="stare">Se încarcă statisticile...</p>
    }

    if (eroare) {
        return (
            <p className="stare eroare">
                Statistici indisponibile: {eroare}
            </p>
        )
    }

    const filtrate = destinatii.filter(
        (destinatie) => destinatie.zile >= Number(prag)
    )
    const totalZile = filtrate.reduce(
        (total, destinatie) => total + destinatie.zile,
        0
    )
    const medie = filtrate.length === 0 ? 0 : totalZile / filtrate.length

    return (
        <section className="panou">
            <h2>Statistici</h2>
            <label>
                Cel puțin{' '}
                <input
                    type="number"
                    min="1"
                    value={prag}
                    onChange={(event) => setPrag(event.target.value)}
                />{' '}
                zile
            </label>

            {filtrate.length === 0 ? (
                <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
            ) : (
                <ul>
                    <li>Destinații: {filtrate.length}</li>
                    <li>Total zile: {totalZile}</li>
                    <li>Media: {medie.toFixed(1)} zile</li>
                </ul>
            )}
        </section>
    )
}
