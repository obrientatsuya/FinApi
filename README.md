### FinApi - IGNITE Node.js


### Step 1 - Como usar?

Abra seu terminal no diretorio e digite:

  ```batch
  npm install express, uuid, nodemon
  ```

É recomendado o uso do Insomnia para testes da API.







---


### Requisitos de criação

- [x] Deve ser possível criar uma conta.
- [x] Deve ser possível buscar o extrato bancário do cliente.
- [x] Deve ser possível realizar um depósito.
- [x] Deve ser possível um saque.
- [x] Deve ser possível buscar o extrato bancário do client por data.
- [x] Deve ser possível atualizar dados da conta do client.
- [x] Deve ser possível obter dados da conta do cliente.
- [x] Deve ser possível deletar uma conta.

---

### Regras de negócio 

- [x] Não deve ser possível cadastrar uma conta com o CPF já existente.
- [x] Não deve ser possível buscar extrato em uma conta não existente.
- [x] Não deve ser possível fazer depósito em uma conta não existente.
- [x] Não deve ser possível fazer saque em uma conta não existente.
- [x] Não deve ser possível fazer saque quando o saldo for insuficiente.
- [x] Não deve ser possível excluir uma conta não existente.
