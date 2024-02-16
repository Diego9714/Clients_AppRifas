require('dotenv').config()

/* ----------- SERVER ----------- */
const PORT                      = process.env.PORT

/* ----------- DATABASE ----------- */
const PG_HOST                   = process.env._HOST
const PG_USER                   = process.env._USER
const PG_PASS                   = process.env._PASS
const PG_NAME                   = process.env._NAME

/* ----------- ROUTES ----------- */

// Users
const GET_CLIENT           = process.env.GET_CLIENT
const REGISTER_CLIENT           = process.env.REGISTER_CLIENT
const EDIT_CLIENT           = process.env.EDIT_CLIENT
const DELETE_CLIENT           = process.env.DELETE_CLIENT


module.exports = {
	// Server
  PORT,
  // Database
  PG_HOST, PG_USER, PG_PASS, PG_NAME,
  // Clients
  GET_CLIENT, REGISTER_CLIENT, EDIT_CLIENT, DELETE_CLIENT
 }
