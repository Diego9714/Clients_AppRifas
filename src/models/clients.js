const pool = require('../utils/mysql.connect.js') 

const bcrypt = require("bcrypt")

// ----- Verify Client -----
const verifyClient = async (clients) => {
  try {
    const connection = await pool.getConnection()

    const regClient = []
    const clientExists = []

    console.log(clients)

    for (const user of clients) {
      let sql = `SELECT id_client FROM clients WHERE address = ? ;`
      const [rows] = await connection.execute(sql, [user.address])

      if (rows.length > 0) {
        clientExists.push(user)
      } else {
        regClient.push(user)
      }
    }

    const msg = {
      status: true,
      message: regClient.length > 0 ? "New Client found" : "All clients already exist",
      code: regClient.length > 0 ? 200 : 404,
      info: {
        regClient,
        clientExists
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Save Client -----
const regClient = async (regClients) => {
  try {
    const Clientscompleted = []
    const ClientsnotCompleted = []
    
    for (const info of regClients) {
      const { id_supervisor , type_supervisor , fullname , address , email, phone, state , sector, direction } = info

      const connection = await pool.getConnection()

      const fechaActual = new Date()
      const date_created = fechaActual.toISOString().split('T')[0]

      let sql = `INSERT INTO clients ( id_supervisor , type_supervisor , fullname , address , email , phone , state , sector , direction , date_created , activation_status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
      const [result] = await connection.execute(sql, [id_supervisor , type_supervisor , fullname , address , email, phone, state , sector, direction, date_created, 1 ])

      if (result.affectedRows > 0) {
        Clientscompleted.push({
          status: true,
          message: "Client registered successfully",
          client: fullname 
        })
      } else {
        ClientsnotCompleted.push({
          status: false,
          message: "Client not registered successfully",
          client: fullname 
        })
      }

      connection.release()
    }

    const msg = {
      status: true,
      message: "Client registration process completed",
      code: 200,
      completed: Clientscompleted,
      notCompleted: ClientsnotCompleted
    }

    return msg

  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Get Clients -----
const getClient = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Clients not found",
      code: 404
    }

    const connection = await pool.getConnection()

    if(type_supervisor == "VED"){
      let sql = `SELECT id_client , fullname , email , phone , direction , address , state , sector , activation_status FROM clients WHERE id_supervisor = ? ;`
      let [seller] = await connection.execute(sql,[id_supervisor])

      if (seller.length > 0) {
        msg = {
          status: true,
          message: "clients found",
          data: seller,
          code: 200
        }
      }
    }else if(type_supervisor == "ADM"){
      let sql = `SELECT id_client , fullname , email , phone , direction , address , state , sector , activation_status FROM clients WHERE id_supervisor = ? ;`
      let [admin] = await connection.execute(sql,[id_supervisor])

      if (admin.length > 0) {
        msg = {
          status: true,
          message: "clients found",
          data: admin,
          code: 200
        }
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Edit Client -----
const editClient = async (clients) => {
  try {
    const Clientscompleted = []
    const ClientsnotCompleted = []

    for (const info of clients) {
      const { id_client , fullname, address, email, phone, direction, state , sector } = info

      const connection = await pool.getConnection()

      const [verify] = await connection.execute(`SELECT id_client FROM clients WHERE id_client = ?;`, [id_client])
    
      if (verify.length > 0) {
        if (verify.length > 0) {
          const [result] = await connection.execute(`UPDATE clients SET fullname = ?, address = ?, email = ?, phone = ?, direction = ?, state = ? , sector = ? WHERE id_client = ?;`, [fullname, address, email, phone, direction, state , sector, id_client])
  
          if (result.affectedRows > 0) {
            Clientscompleted.push({
              status: true,
              message: "Client edited successfully",
              client: fullname
            })
          } else {
            ClientsnotCompleted.push({
              status: false,
              message: "Client not edited successfully",
              client: fullname
            })
          }
        } else {
          ClientsnotCompleted.push({
            status: false,
            message: "Client not found",
            seller: fullname
          })
        }
      } else {
        ClientsnotCompleted.push({
          status: false,
          message: "Client not found",
          client: fullname
        })
      }

      connection.release()
    }

    const msg = {
      status: true,
      message: "Edit process completed",
      code: 200,
      completed: Clientscompleted,
      notCompleted: ClientsnotCompleted
    }

    return msg

  } catch (err) {
    console.log(err)
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Delete Client -----
// const deleteClient = async ({ data }) => {
//   try {
//     let msg = {
//       status: false,
//       message: "Client not deleted",
//       code: 500
//     }

//     const connection = await pool.getConnection()
    
//     let updateSql = `UPDATE clients SET activation_status = ? WHERE id_client = ?;`;
//     const client = await connection.execute(updateSql, [0, id_client]);

//     if (client.length > 0) {
//       msg = {
//         status: true,
//         message: "Client deleted succesfully",
//         code: 200
//       }
//     }

//     connection.release()

//     return msg

//   } catch (err) {
//     console.log(err)
//     let msg = {
//       status: false,
//       message: "Something went wrong...",
//       code: 500,
//       error: err,
//     }
//     return msg
//   }
// }

const deleteClient = async ({ data }) => {
  try {
    const connection = await pool.getConnection();

    let sql = `SELECT id_client FROM clients WHERE id_client = ? ;`;
    let [verify] = await connection.execute(sql, [id_client]);

    let msg = {
      status: false,
      message: "Client not activated",
      code: 500
    };

    if (verify.length > 0) {
      let updateSql = `UPDATE clients SET activation_status = ? WHERE id_client = ?;`;
      const [client] = await connection.execute(updateSql, [activation_status, id_client]);

      if (client.affectedRows > 0) {
        msg = {
          status: true,
          message: activation_status ? "Client Activated successfully" : "Client Disabled successfully",
          code: 200
        };
      }
    }

    connection.release();
    return msg;
  } catch (err) {
    console.log(err);
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    };
    return msg;
  }
};


module.exports = {
  getClient,
  verifyClient,
  regClient,
  editClient,
  deleteClient
}
