const Clients = require('../models/clients.js')

const controller = {}

controller.getClients = async (req, res) => {
  try {
    const data = { id_supervisor , type_supervisor } = req.params
    const user  = await Clients.getClient(data)
    res.status(user.code).json(user)
  } catch (err) {
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

module.exports = controller
