const Clients = require('../models/clients.js')

const controller = {}

// ----- Save Client -----
controller.regClient = async (req, res) => {
  try {
    const { clients } = req.body

    const filterClient = Object.keys(clients)

    if (filterClient.length > 0) {
      const verify = await Clients.verifyClient(clients)

      const regClients = verify.info.regClient
      const clientExists = verify.info.clientExists

      let registeredClients = []
      let existingClients = []

      if (regClients.length > 0) {
        const userClient = await Clients.regClient(regClients)

        registeredClients = userClient.completed.map(client => client.client)
        existingClients = clientExists.map(client => client.email)
        
        res.status(userClient.code).json({
          message: "Registration process completed",
          status: true,
          code: userClient.code,
          registeredClients: registeredClients,
          existingClients: existingClients,
          notRegisteredClients: userClient.notCompleted
        })
      } else {
        res.status(500).json({ message: "All clients are already registered", status: false, code: 500 })
      }
    } else {
      res.status(400).json({ message: "No clients provided in the request", status: false, code: 400 })
    }

  } catch (error) {
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

// ----- Edit Client -----
controller.editClient = async (req, res) => {
  try {
    const { clients } = req.body

    userClient = await Clients.editClient(clients)
    res.status(userClient.code).json(userClient)
  
  } catch (error) {
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

// ----- Delete Client -----
controller.deleteClient = async (req, res) => {
  try {
    const data = {id_client , activation_status} = req.params

    userClient = await Clients.deleteClient(data)
    console.log(userClient);
    res.status(userClient.code).json(userClient)
  
  } catch (error) {
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

module.exports = controller
