import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Varianta ÎNAINTE de corectare (cu concatenare directă) pentru Măsurătoarea 4 / Captura 4
router.get('/raport', async (req, res) => {
  try {
    const metoda = req.query.metoda
    let sql = `SELECT metoda, cale, COUNT(*) AS cereri, ROUND(AVG(durata_ms), 1) AS medie_ms FROM jurnal`

    if (metoda) {
      // Concatenare nesigura - produce SQL Injection la GET' OR '1'='1
      sql += ` WHERE metoda = '${metoda}'`
    }

    sql += ` GROUP BY metoda, cale ORDER BY cereri DESC LIMIT 10`

    const [randuri] = await pool.query(sql)
    res.json(
      randuri.map((r) => ({
        ...r,
        cereri: Number(r.cereri),
        medie_ms: Number(r.medie_ms),
      }))
    )
  } catch (error) {
    console.error('Eroare la raport:', error.message)
    res.status(500).json({ eroare: error.message })
  }
})

export default router
