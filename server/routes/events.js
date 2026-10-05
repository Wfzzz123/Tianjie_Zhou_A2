const express = require('express');
const db = require('../event_db');

const router = express.Router();

const LIST_FIELDS = `
  e.id,
  e.name,
  e.short_description,
  e.event_date,
  e.location,
  e.ticket_price,
  e.goal_amount,
  e.current_amount,
  c.id AS category_id,
  c.name AS category_name
`;

function markTiming(row) {
  const eventDay = new Date(row.event_date);
  const today = new Date();
  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  row.status = eventDay.getTime() >= today.getTime() ? 'upcoming' : 'past';
  return row;
}

function fail(res, err, text) {
  console.error(err);
  res.status(500).json({ error: text });
}

router.get('/', async function (req, res) {
  try {
    const sql =
      'SELECT ' + LIST_FIELDS +
      ' FROM events e INNER JOIN categories c ON c.id = e.category_id' +
      ' WHERE e.is_suspended = 0 AND DATE(e.event_date) >= CURDATE()' +
      ' ORDER BY e.event_date';
    const [rows] = await db.query(sql);
    res.json(rows.map(markTiming));
  } catch (err) {
    fail(res, err, 'Could not read events');
  }
});

router.get('/search', async function (req, res) {
  try {
    const filters = ['e.is_suspended = 0'];
    const values = [];

    if (req.query.date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(req.query.date)) {
        res.status(400).json({ error: 'Date must be YYYY-MM-DD.' });
        return;
      }
      filters.push('DATE(e.event_date) = ?');
      values.push(req.query.date);
    }

    if (req.query.location) {
      filters.push('e.location LIKE ?');
      values.push('%' + req.query.location + '%');
    }

    if (req.query.category) {
      filters.push('e.category_id = ?');
      values.push(req.query.category);
    }

    const sql =
      'SELECT ' + LIST_FIELDS +
      ' FROM events e INNER JOIN categories c ON c.id = e.category_id' +
      ' WHERE ' + filters.join(' AND ') +
      ' ORDER BY e.event_date';

    const [rows] = await db.query(sql, values);
    res.json(rows.map(markTiming));
  } catch (err) {
    fail(res, err, 'Search failed');
  }
});

router.get('/:id', async function (req, res) {
  try {
    const sql =
      'SELECT e.id, e.name, e.short_description, e.full_description, e.purpose,' +
      ' e.event_date, e.location, e.ticket_price, e.goal_amount, e.current_amount,' +
      ' c.id AS category_id, c.name AS category_name, o.name AS organisation_name' +
      ' FROM events e' +
      ' INNER JOIN categories c ON c.id = e.category_id' +
      ' INNER JOIN organisations o ON o.id = e.organisation_id' +
      ' WHERE e.id = ? AND e.is_suspended = 0';

    const [rows] = await db.query(sql, [req.params.id]);
    if (!rows.length) {
      res.status(404).json({ error: 'No public event with that id' });
      return;
    }
    res.json(markTiming(rows[0]));
  } catch (err) {
    fail(res, err, 'Could not read that event');
  }
});

module.exports = router;
