import { useState } from 'react'
import { destinatii as destinatiiInitiale } from './data/destinatii.js'
import { adaugaDestinatie, stergeDestinatie } from './utils/destinatii.js'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import Rezumat from './components/Rezumat.jsx'
import './App.css'

export default function App() {
    const [destinatii, setDestinatii] = useState(destinatiiInitiale)
    const nevizitate = destinatii.filter((destinatie) => !destinatie.vizitat)
    const zileDeVizitat = nevizitate.reduce(
        (total, destinatie) => total + destinatie.zile,
        0
    )

    function toggleVizitat(id) {
        setDestinatii((listaCurenta) =>
            listaCurenta.map((destinatie) =>
                destinatie.id === id
                    ? { ...destinatie, vizitat: !destinatie.vizitat }
                    : destinatie
            )
        )
    }

    function handleAdd(destinatieNoua) {
        setDestinatii((listaCurenta) =>
            adaugaDestinatie(listaCurenta, destinatieNoua)
        )
    }

    function handleDelete(id) {
        setDestinatii((listaCurenta) => stergeDestinatie(listaCurenta, id))
    }

    return (
        <main>
            <h1>City Explorer</h1>
            <Rezumat
                total={destinatii.length}
                nevizitate={nevizitate.length}
                zile={zileDeVizitat}
            />
            <FormularDestinatie onAdd={handleAdd} />
            <ListaDestinatii
                destinatii={destinatii}
                onToggleVisit={toggleVizitat}
                onDelete={handleDelete}
            />
        </main>
    )
}