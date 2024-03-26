const pool = require('../utils/mysql.connect.js') 

const bcrypt = require("bcrypt")

// ----- Verify Client -----
const verifyClient = async ({clients}) => {
  try {
    let msg = {
      status: false,
      message: "User not found",
      code: 404
    }

    const connection = await pool.getConnection()

    let sql = `SELECT id_client , fullname FROM clients WHERE address = ? ;`
    const [rows] = await connection.execute(sql, [address])

    if (rows.length > 0) {
      msg = {
        status: false,
        message: "User already exist",
        code: 500,
        name_user: rows[0].fullname,
        address_user: address
      }
    }else{
      msg = {
        status: true,
        message: "New user to register",
        code: 200,
        name_user: fullname,
        address_user: address
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
const regClient = async ({clients}) => {
  try {
    let msg = {
      status: false,
      message: "Client not Registered",
      code: 500
    }

    const connection = await pool.getConnection()

    const fechaActual = new Date()
    const date_created = fechaActual.toISOString().split('T')[0]

    let sql = `INSERT INTO clients ( id_supervisor , type_supervisor , fullname , address , phone , country , state , sector , direction , date_created , activation_status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
    const [result] = await connection.execute(sql, [id_supervisor , type_supervisor , fullname , address , phone, country, state , sector, direction, date_created, 1 ])

    if (result.affectedRows > 0) {
      msg = {
        status: true,
        message: "Client registered successfully",
        code: 200,
        client: fullname 
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
      
      // Obtener clientes creados por ti (VED)
      let sqlBOSS = `SELECT id_boss FROM sellers WHERE id_seller = ?;`
      let [idBoss] = await connection.execute(sqlBOSS, [id_supervisor])

      console.log(idBoss)

      let sqlAdmin = `
        SELECT id_client, fullname, phone, direction, address, country, state, sector, activation_status
        FROM clients
        WHERE id_supervisor = ? AND type_supervisor = "ADM";
      `;
      let [clientsAdmin] = await connection.execute(sqlAdmin, [idBoss[0].id_boss]);

      // Obtener clientes creados por ti (VED)
      let sqlSeller = `
      SELECT id_client, fullname, phone, direction, address, country, state, sector, activation_status
      FROM clients
      WHERE id_supervisor = ? AND type_supervisor = "VED" ;
      `
      let [clientsSeller] = await connection.execute(sqlSeller, [id_supervisor])

      // Concatenar resultados en un solo arreglo
      let allClients = clientsAdmin.concat(clientsSeller);

      if (allClients.length > 0) {
        msg = {
          status: true,
          message: "clients found",
          data: allClients,
          code: 200
        };
      }

    }else if(type_supervisor == "ADM"){
      
      // Obtener clientes creados por ti (ADM)
      let sqlAdmin = `
        SELECT id_client, fullname, phone, direction, address, country, state, sector, activation_status
        FROM clients
        WHERE id_supervisor = ? AND type_supervisor = "ADM";
      `;
      let [clientsAdmin] = await connection.execute(sqlAdmin, [id_supervisor]);

      // Obtener clientes creados por tus vendedores y excluir los clientes ya obtenidos en la primera consulta
      let sqlSeller = `
        SELECT
        clients.id_client, clients.fullname, clients.phone, clients.direction, clients.address, clients.country, clients.state, clients.sector, clients.activation_status
        FROM clients
        INNER JOIN sellers ON clients.id_supervisor = sellers.id_seller 
        WHERE sellers.id_boss = ? AND clients.id_client NOT IN (${clientsAdmin.map(client => client.id_client).join(',')});
      `;
      let [clientsSeller] = await connection.execute(sqlSeller, [id_supervisor]);

      // Concatenar resultados en un solo arreglo
      let allClients = clientsAdmin.concat(clientsSeller);

      if (allClients.length > 0) {
        msg = {
          status: true,
          message: "clients found",
          data: allClients,
          code: 200
        };
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
const editClient = async ({clients}) => {
  try {
    let msg = {
      status: false,
      message: "Client not edited",
      code: 500
    }
    
    const connection = await pool.getConnection()

    const [verify] = await connection.execute(`SELECT id_client FROM clients WHERE id_client = ?;`, [id_client])

    if (verify.length > 0) {
      const [result] = await connection.execute(`UPDATE clients SET fullname = ?, address = ?, phone = ?, direction = ?, state = ? , country = ? , sector = ? WHERE id_client = ?;`, [fullname, address, phone, direction, state ,  country, sector, id_client])

      if (result.affectedRows > 0) {
        msg = {
          status: true,
          message: "Client edited successfully",
          code: 200,
          client: fullname
        }
      }
    } else {
      msg = {
        status: false,
        message: "Client not found",
        code: 404,
        seller: fullname
      }
    }

    connection.release()
  
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

const deleteClient = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Client not deleted",
      code: 500
    }
    
    const connection = await pool.getConnection()
    
    let sql = `SELECT id_client FROM clients WHERE id_client = ? ;`
    let [verify] = await connection.execute(sql,[id_client])

    if (verify.length > 0) {

      let updateSql = `UPDATE clients SET activation_status = ? WHERE id_client = ?;`;
      const client =  await connection.execute(updateSql, [activation_status , id_client])

      if (client.length > 0 && activation_status == 1) {
        msg = {
          status: true,
          message: "Client Activated succesfully",
          code: 200
        }
      }else if (client.length > 0 && activation_status == 0) {
        msg = {
          status: true,
          message: "Client Disabled succesfully",
          code: 200
        }
      }
    }

    connection.release()

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

module.exports = {
  getClient,
  verifyClient,
  regClient,
  editClient,
  deleteClient
}
