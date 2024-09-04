# PatrimoniX

Gerenciar investimentos no Brasil ficou mais fácil com a popularização dos smartphones e da internet. 

No entanto, administrar carteiras diversificadas ainda é um desafio. Tomar decisões estratégicas exige organização e controle, algo que se torna complexo conforme a carteira de investimentos cresce. 

Pensando nisso, nossa proposta é a criação de um sistema para facilitar o gerenciamento de carteiras de investimento.

## Sobre o Projeto

O PatrimoniX é um sistema web responsivo desenvolvido para auxiliar no gerenciamento dos ativos que compõem a carteira de investidores, sejam eles iniciantes ou experientes. O sistema oferece:

- Resumo do total investido.
- Quantidade em reais investidos em cada ativo.
- Gráficos de distribuição e rentabilidade.
- Proventos recebidos.
- Histórico de compras e vendas realizadas.
- Metas
- Aporte Automatizado

## Responsabilidades no Projeto

- Frontend:
    1. Página Metas
    2. Melhoria da perfomarce na consulta ao Backend
    3. Separação dos ativos pelo tipo e correções de bug na página Carteira

- Backend:
    1. Endpoint metas
    2. Endpoint api

- Banco de Dados:
    1. Schema da tabela Quotes
    2. Schema da tabela Metas


## Tecnologias Necessárias

- Docker

## Como Instalar?

1. Faça o clone do repositório e preencha o arquivo `.env` conforme o `.env.example`.

### Para Desenvolvimento

2. Suba os contêineres com o seguinte comando:

```
sudo docker compose up --build -d
```

3. Popule o banco de dados pre cadastrados com o comando:
 
```
sudo docker exec -it backend_patrimonix npm run populate
```
4. Login para teste:
```
Login: teste@gmail.com
Senha: senha123
```
## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.







