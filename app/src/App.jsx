import { useEffect, useState } from 'react'
import { deleteDestinatie, getDestinatii, patchVizitat, postDestinatie } from './api/destinatii.js'
import Cautare from './components/Cautare.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import PanouStatistici from './components/PanouStatistici.jsx'
import Rezumat from './components/Rezumat.jsx'
import { getNevizitate } from './utils/destinatii.js'
import './App.css'

export default function App() {
    const [destinatii, setDestinatii] = useState([])
    const [incarcare, setIncarcare] = useState(true)
    const [eroare, setEroare] = useState('')
    const [eroareActiune, setEroareActiune] = useState('')
    const [seTrimite, setSeTrimite] = useState(false)
    const [cautare, setCautare] = useState('')
    const [pagina, setPagina] = useState(1)
    const [totalPagini, setTotalPagini] = useState(1)

    useEffect(() => {
        let efectActiv = true

        async function incarcaDestinatii() {
            setIncarcare(true)
            setEroare('')

            try {
                const rezultat = await getDestinatii(pagina)

                if (!efectActiv) return

                const pagini = Math.max(1, rezultat.pages)
                setDestinatii(rezultat.data)
                setTotalPagini(pagini)

                if (pagina > pagini) {
                    setPagina(pagini)
                }
            } catch (error) {
                if (efectActiv) {
                    setEroare(error.message)
                }
            } finally {
                if (efectActiv) {
                    setIncarcare(false)
                }
            }
        }

        incarcaDestinatii()

        return () => {
            efectActiv = false
        }
    }, [pagina])

    async function handleToggleVisit(id) {
        const destinatie = destinatii.find((item) => item.id === id)
        if (!destinatie) return

        setEroareActiune('')

        try {
            const salvata = await patchVizitat(id, !destinatie.vizitat)
            setDestinatii((listaCurenta) =>
                listaCurenta.map((item) => (item.id === id ? salvata : item))
            )
        } catch (error) {
            setEroareActiune(error.message)
        }
    }

    async function handleAdd(destinatieNoua) {
        setSeTrimite(true)
        setEroareActiune('')

        try {
            const salvata = await postDestinatie(destinatieNoua)
            setDestinatii((listaCurenta) => [...listaCurenta, salvata])
            return true
        } catch (error) {
            setEroareActiune(error.message)
            return false
        } finally {
            setSeTrimite(false)
        }
    }

    async function handleDelete(id) {
        setEroareActiune('')

        try {
            await deleteDestinatie(id)

            if (destinatii.length === 1 && pagina > 1) {
                setPagina((paginaCurenta) => paginaCurenta - 1)
            } else {
                setDestinatii((listaCurenta) =>
                    listaCurenta.filter((item) => item.id !== id)
                )
            }
        } catch (error) {
            setEroareActiune(error.message)
        }
    }

    const nevizitate = getNevizitate(destinatii)
    const zileDeVizitat = nevizitate.reduce(
        (total, destinatie) => total + destinatie.zile,
        0
    )
    const textCautat = cautare.trim().toLowerCase()
    const destinatiiAfisate = destinatii.filter(
        (destinatie) =>
            destinatie.oras.toLowerCase().includes(textCautat) ||
            destinatie.tara.toLowerCase().includes(textCautat)
    )

    return (
        <main>
            <h1>City Explorer</h1>
            <PanouStatistici />
            {eroareActiune && (
                <p className="stare eroare">Operația nu a reușit: {eroareActiune}</p>
            )}
            {incarcare ? (
                <p className="stare">Se încarcă destinațiile...</p>
            ) : eroare ? (
                <p className="stare eroare">Nu s-au putut încărca destinațiile: {eroare}</p>
            ) : (
                <>
                    <Rezumat
                        total={destinatii.length}
                        nevizitate={nevizitate.length}
                        zile={zileDeVizitat}
                    />
                    <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />
                    <Cautare valoare={cautare} onChange={setCautare} />
                    {destinatiiAfisate.length > 0 ? (
                        <ListaDestinatii
                            destinatii={destinatiiAfisate}
                            onToggleVisit={handleToggleVisit}
                            onDelete={handleDelete}
                        />
                    ) : destinatii.length === 0 ? (
                        <p className="gol">Nu există destinații. Adaugă una folosind formularul.</p>
                    ) : (
                        <p className="gol">
                            Niciun rezultat pentru „{cautare.trim()}”.
                        </p>
                    )}
                    <nav className="paginare" aria-label="Navigare între pagini">
                        <button
                            type="button"
                            onClick={() => setPagina((paginaCurenta) => paginaCurenta - 1)}
                            disabled={pagina === 1 || incarcare}
                        >
                            Înapoi
                        </button>
                        <span>
                            pagina {pagina} din {totalPagini}
                        </span>
                        <button
                            type="button"
                            onClick={() => setPagina((paginaCurenta) => paginaCurenta + 1)}
                            disabled={pagina === totalPagini || incarcare}
                        >
                            Înainte
                        </button>
                    </nav>
                </>
            )}
        </main>
    )
}
