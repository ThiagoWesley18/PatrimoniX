export interface transaction {
    id: string,
    tax: number,
    executionDate: string,
    transactionType: string,
    totalValue: number,
    quantity: number,
    price: number,
    userCpf: string,  
    tradingCode: string
}

export interface transactionSubmit {
    tax: number,
    executionDate: string,
    transactionType: string,
    totalValue: number,
    quantity: number,
    price: number,
    userCpf: string,
    tradingCode: string,  
}

export interface userTransaction {
    id: string,
    tax: number,
    executionDate: string,
    transactionType: string,
    totalValue: number,
    quantity: number,
    price: number,
    userCpf: string,
    tradingCode: string, 
    Ativo: {
        tradingCode: string,
        cnpj: string,
        nomeInstituicao: string,
        tipo: string
    }
}