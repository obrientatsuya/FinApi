/*###########################################*/
const { response } = require('express');
const express = require('express');
const app = express();
const { v4: uuidv4 } = require("uuid")
/*###########################################*/



/* Pseudo Database; Array */
const customers = [];
app.use(express.json());



/* Middleware. Valida conta existente via CPF */
function verificaSeAccExisteCpf(request, response, next) {
    
    const { cpf } = request.headers;
    const customer = customers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return response.status(400).json({error: "Usuário não encontrado."});
    }
    request.customer = customer;
    
    return next();
}


/* Calculo de depósito/saque, retorna se não tiver suficiente. */
function getBalance(statement) {
    
    const balance = statement.reduce((acumulador, operation) => {
        if(operation.type ==='credit') {
            return acumulador + operation.amount;
        } else {
            return acumulador - operation.amount;
        }
    }, 0);
    return balance;
}


/* Cria conta, e confirma se já está cadastrado */
app.post("/account", (request, response) => {
    
    const { cpf, name } = request.body; 
    const customerJáExiste = customers.some (
        (customer) => customer.cpf === cpf
    );
    
    if(customerJáExiste) {
        return response.status(400).json({error: "CPF já cadastrado!"});
    }
    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: [],
    });
    return response.status(201).send();
});


/* Extrai o extrato/statement por CPF */
app.get("/statement", verificaSeAccExisteCpf, (request, response) => {
    
    const { customer } = request;
    return response.json(customer.statement);

});


/* Deposito. */
app.post("/deposit", verificaSeAccExisteCpf, (request, response) => {
    
    const { description, amount } = request.body;
    const { customer } = request;
    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }
    
    customer.statement.push(statementOperation);
    return response.status(201).send();

})


/* Saque. */
app.post("/withdraw", verificaSeAccExisteCpf, (request, response) => {
    
    const { amount } = request.body;
    const { customer } = request;

    const balance = getBalance(customer.statement);
    if(balance < amount) {
        return response.status(400).json({error:"erro, sem fundos!"})
    }
    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };
    
    customer.statement.push(statementOperation);
    return response.status(201).json({sucessfull:"saque concluido."});

});


/* Extrato buscado por data */
app.get("/statement/date", verificaSeAccExisteCpf, (request, response) => {
 
    const { customer } = request;
    const { date } = request.query;
    
 const dateFormat = new Date(date + " 00:00"); 
 const statement = customer.statement.filter((statement) => 
 statement.created_at.toDateString() === 
 
 new Date (dateFormat).toDateString())
 
 
return response.json(statement);

}); 


/* Atualiza informações da conta. */ 
app.put("/account", verificaSeAccExisteCpf, (request, response) => {
    
    const { name } = request.body;
    const { customer } = request; 
    customer.name = name;

    return response.status(201).send();

})


/* Puxa os dados da conta. */
app.get("/account", verificaSeAccExisteCpf, (request, response) => {
    
    const { customer } = request;
    
    return response.json(customer);

});


/* Deleta conta. */
app.delete("/account", verificaSeAccExisteCpf, (request, response) => {
    
    const { customer } = request; 
    customers.splice(customer, 1);

    return response.status(200).json(customers);

});


/* Mostra o saldo total. */
app.get("/balance", verificaSeAccExisteCpf, (request, response) => {
    
    const { customer } = request;
    const balance = getBalance(customer.statement);

    return response.json(balance);

});


/* http:localhost:3333 */
app.listen(3333);


/** 
 * GET - Buscar uma informação dentro do servidor
 * POST- Inserir uma informação no servidor
 * PUT - Alterar uma informação no servidor
 * PATCH - Alterar uma informação especifica
 * DELETE - Deletar uma informação no servidor
*/
/**
 * Tipos de parâmetros
 * 
 * Route Params => Identificar um recurso p editar/deletar/buscar
 * Query Params => Paginação / Filtro
 * Body Params => Os objetos usados para inserção/alteração (JSON)
 * 
 * cpf - string
 * name -string
 * id - uuid
 * statement []
 */
