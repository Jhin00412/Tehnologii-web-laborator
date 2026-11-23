import { pool } from './db.js'

export function jurnal(req, res, next) {
  const inceput = process.hrtime.bigint()
  const cale = req.originalUrl

  res.on('finish', async () => {
    try {
      const durata = Math.round(Number(process.hrtime.bigint() - inceput) / 1e6)
      await pool.query(
        'INSERT INTO jurnal (metoda, cale, status, durata_ms) VALUES (?, ?, ?, ?)',
        [req.method, cale, res.statusCode, durata]
      )
    } catch (err) {
      console.error('Eroare jurnal:', err)
    }
  })

  next()
}
