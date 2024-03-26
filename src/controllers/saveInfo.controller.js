const Clients = require('../models/clients.js')

const controller = {}

// ----- Save Client -----
controller.regClient = async (req, res) => {
  try {
    const clients = {id_supervisor,type_supervisor,fullname,address,email,phone,direction,country,state,sector} = req.body
    console.log(clients)
    const filterClient = Object.keys(clients)

    if (filterClient.length > 0) {
      const verify = await Clients.verifyClient(clients)
      console.log(verify)

      if(verify.code == 200){
        const processReg = await Clients.regClient(clients)
        console.log(processReg)
        
        return res.status(processReg.code).json(processReg)        
      }else{
        return res.status(verify.code).json(verify)
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
    const clients = {id_client,fullname,address,email,phone,direction,state,sector} = req.body

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

    res.status(userClient.code).json(userClient)
  
  } catch (error) {
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

module.exports = controller
