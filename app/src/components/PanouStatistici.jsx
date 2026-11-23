import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
  const [statistici, setStatistici] = useState({ destinatii: 0, zile: 0, medie: 0 })
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState('')
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')

  useEffect(() => {
    let activ = true

    async function incarca() {
      setIncarcare(true)
      setEroare('')
      try {
        const date = await getStatistici(prag, tara.trim())
        if (activ) {
          setStatistici(date)
        }
      } catch (err) {
        if (activ) {
          setEroare(err.message)
        }
      } finally {
        if (activ) {
          setIncarcare(false)
        }
      }
    }

    incarca()

    return () => {
      activ = false
    }
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <label>
          Cel puțin{' '}
          <input
            type="number"
            min="1"
            value={prag}
            onChange={(event) => setPrag(event.target.value)}
            style={{ width: '60px' }}
          />{' '}
          zile
        </label>
        <label>
          Țară{' '}
          <input
            type="text"
            placeholder="toate"
            value={tara}
            onChange={(event) => setTara(event.target.value)}
          />
        </label>
      </div>

      {incarcare ? (
        <p className="stare">Se încarcă statisticile...</p>
      ) : eroare ? (
        <p className="stare eroare">Statistici indisponibile: {eroare}</p>
      ) : (
        <ul>
          <li>Destinații: {statistici.destinatii}</li>
          <li>Total zile: {statistici.zile}</li>
          <li>Media: {statistici.medie} zile</li>
        </ul>
      )}
    </section>
  )
}
