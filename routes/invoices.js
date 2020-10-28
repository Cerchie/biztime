

const db = require("../db");
const express = require("express");
const router = express.Router();


/**  Get  invoices */

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
          `SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices`);

    return res.json(results.rows);
  }

  catch (err) {
    return next(err);
  }
});

router.get("/:id", async function(req,res,next){
  try{
      const id = req.query.id;
     const result = await db.query(
         `SELECT id, comp_code, amt, paid, add_date, paid_date WHERE id = '${id}'`
     );
     return res.json(result.rows)
  } catch(e){}
});

/** Create new invoice */

router.post("/", async function (req, res, next) {
  try {
    const { id, comp_code, amt, paid, add_date, paid_date } = req.body;

    const result = await db.query(
          `INSERT INTO invoices (id, comp_code, amt, paid, add_date, paid_date ) 
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, comp_code, amt, paid, add_date, paid_date `,
        [id, comp_code, amt, paid, add_date, paid_date]
    );

    return res.status(201).json(result.rows[0]);
  }

  catch (err) {
    return next(err);
  }
});


/** Update invoice*/

router.patch("/:id", async function (req, res, next) {
  try {
    const { id, comp_code, amt, paid, add_date, paid_date } = req.body;

    const result = await db.query(
          `UPDATE invoices SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5
           WHERE id = $6
           RETURNING id, comp_code, amt, paid, add_date, paid_date`,
        [comp_code, amt, paid, add_date, paid_date, req.params.id]
    );

    return res.json(result.rows[0]);
  }

  catch (err) {
    return next(err);
  }
});


/** Delete invoice, returning {message: "Deleted"} */

router.delete("/:id", async function (req, res, next) {
  try {
    const result = await db.query(
        "DELETE FROM invoices WHERE id = $1",
        [req.params.id]
    );

    return res.json({message: "Deleted"});
  }

  catch (err) {
    return next(err);
  }
});
// end


module.exports = router;