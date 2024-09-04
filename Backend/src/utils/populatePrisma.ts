import { PrismaClient, Tipo_Ativo, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { cnpj } from 'cpf-cnpj-validator';
import { genSalt, hash } from "bcryptjs";
import ativos from '../../data/ativos2.json';

const prisma = new PrismaClient();

async function main() {
  async function createTiposAtivo() {
    const uniqueTypes = new Set(ativos.ativos.map(ativo => ativo.type));
    const tipos: Tipo_Ativo[] = [];

    for (const type of uniqueTypes) {

      const existingType = await prisma.tipo_Ativo.findUnique({
        where: { tipo: type }
      });

      if (!existingType) {
        const novoTipo = await prisma.tipo_Ativo.create({
          data: {
            tipo: type,
          },
        });
        tipos.push(novoTipo);
        console.log(`Tipo de Ativo "${type}" criado com sucesso!`);
      } else {
        tipos.push(existingType);
        console.log(`Tipo de Ativo "${type}" já existe no banco de dados.`);
      }
    }

    return tipos;
  }

  async function createTestAccount(cpf: string, name: string, email: string) {
    const existingAccount = await prisma.user.findUnique({ where: { cpf } });
    if (existingAccount) {
      console.log(`Conta de teste para CPF "${cpf}" já existe no banco de dados.`);
      return existingAccount;
    }

    const rounds = parseInt(process.env.BCRYPT_ROUNDS!);
    const salt = await genSalt(rounds);
    const password = await hash("senha123", salt);
    const user = await prisma.user.create({
      data: {
        cpf,
        name,
        lastName: "Silva",
        email,
        password: password,
        phone: faker.string.numeric("###########"),
      },
    })
    console.log(`Conta de teste para CPF "${cpf}" criada com sucesso!`);
    return user;
  }

  /* async function createFakeAtivos(tipos: Tipo_Ativo[]) {
    const ativosCriados = [];
    const ativosCadastrados = new Set<string>();

    for (const tipo of tipos) {
      // Para cada tipo, tenta inserir mais de 1 ativo
      for (let i = 0; i < 4; i++) {
        const ativosDoTipo = ativos.ativos.filter(ativo => ativo.type === tipo.tipo);
        let ativo = faker.helpers.arrayElement(ativosDoTipo);

        while (ativosCadastrados.has(ativo.ticket)) {
          ativo = faker.helpers.arrayElement(ativosDoTipo);
        }

        const existingAtivo = await prisma.ativo.findUnique({
          where: { tradingCode: ativo.ticket }
        });

        if (!existingAtivo) {
          const novoAtivo = await prisma.ativo.create({
            data: {
              tradingCode: ativo.ticket,
              nomeInstituicao: ativo.name,
              cnpj: cnpj.generate(),
              tipo: ativo.type,
            },
          });
          ativosCriados.push(novoAtivo);
          ativosCadastrados.add(ativo.ticket);
          console.log(`Ativo "${ativo.ticket}" do tipo "${tipo.tipo}" criado com sucesso!`);
        } else {
          ativosCriados.push(existingAtivo);
          console.log(`Ativo "${ativo.ticket}" do tipo "${tipo.tipo}" já existe no banco de dados.`);
        }
      }
    } */
   async function createFakeAtivos(tipos: Tipo_Ativo[]) {
    const ativosCriados = [];
    const ativosCadastrados = new Set<string>();

    for (const tipo of tipos) {
      const ativosDoTipo = ativos.ativos.filter(ativo => ativo.type === tipo.tipo);
      let ativo = faker.helpers.arrayElement(ativosDoTipo);

      while (ativosCadastrados.has(ativo.ticket)) {
        ativo = faker.helpers.arrayElement(ativosDoTipo);
      }

      const existingAtivo = await prisma.ativo.findUnique({
        where: { tradingCode: ativo.ticket }
      });

      if (!existingAtivo) {
        const novoAtivo = await prisma.ativo.create({
          data: {
            tradingCode: ativo.ticket,
            nomeInstituicao: ativo.name,
            cnpj: cnpj.generate(),
            tipo: ativo.type,
          },
        });
        ativosCriados.push(novoAtivo);
        ativosCadastrados.add(ativo.ticket);
        console.log(`Ativo "${ativo.ticket}" do tipo "${tipo.tipo}" criado com sucesso!`);
      } else {
        ativosCriados.push(existingAtivo);
        console.log(`Ativo "${ativo.ticket}" do tipo "${tipo.tipo}" já existe no banco de dados.`);
      }
    }
    // cria ativos aleatoriamente evitando duplicatas
    const totalAtivosDesejado = ativos.ativos.length;
    for (let i = ativosCriados.length; i < totalAtivosDesejado; i++) {
      let ativo = faker.helpers.arrayElement(ativos.ativos);

      while (ativosCadastrados.has(ativo.ticket)) {
        ativo = faker.helpers.arrayElement(ativos.ativos);
      }

      const existingAtivo = await prisma.ativo.findUnique({
        where: { tradingCode: ativo.ticket }
      });

      if (!existingAtivo) {
        try {
          const novoAtivo = await prisma.ativo.create({
            data: {
              tradingCode: ativo.ticket,
              nomeInstituicao: ativo.name,
              cnpj: cnpj.generate(),
              tipo: ativo.type,
            },
          });
          ativosCriados.push(novoAtivo);
          ativosCadastrados.add(ativo.ticket);
          console.log(`Ativo "${ativo.ticket}" criado com sucesso!`);
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log(`Ativo "${ativo.ticket}" já existe no banco de dados.`);
      }
    }

    return ativosCriados;
  }

  async function createFakeTransactions(user: User, ativosCriados: any[]) {
    const transactions = [];
    for (let i = 0; i < 20; i++) {
      const ativo = faker.helpers.arrayElement(ativosCriados);

      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          userCpf: user.cpf,
          tradingCode: ativo.tradingCode,
          executionDate: {
            gte: faker.date.recent({ days: 365 }), // verifica transaçoes recentes
            lte: new Date()
          }
        }
      });

      if (!existingTransaction) {
        // cria a transação se não existir uma recente
        transactions.push(
          prisma.transaction.create({
            data: {
              tax: faker.number.float({ min: 10, max: 500 }),
              executionDate: faker.date.between({
                from: faker.date.recent({ days: 365 }),
                to: new Date()
              }),
              transactionType: faker.helpers.arrayElement(['Compra']),
              totalValue: faker.number.float({
                min: 1000,
                max: 10000,
                multipleOf: 0.01,
              }),
              quantity: faker.number.int({ min: 1, max: 100 }),
              price: faker.number.float({ min: 6, max: 100, multipleOf: 0.01 }),
              userCpf: user.cpf,
              tradingCode: ativo.tradingCode,
            },
          })
        );
      } else {
        console.log(`Transação para o usuário "${user.cpf}" e ativo "${ativo.tradingCode}" já existe no banco de dados.`);
      }
    }

    await Promise.all(transactions);
    console.log(`Novas transações criadas com sucesso para o usuário "${user.cpf}"!`);
  }

  async function populateChangelog() {
    const changelogs = [
      { id: 1, sprint_name: "Sprint 1" },
      { id: 2, sprint_name: "Sprint 2" },
      { id: 3, sprint_name: "Sprint 3" },
      { id: 4, sprint_name: "Sprint 4" },
      { id: 5, sprint_name: "Sprint 5" }
    ];

    for (const changelog of changelogs) {
      await prisma.changelog.upsert({
        where: { id: changelog.id },
        update: {},
        create: changelog,
      });
    }

    const changes = [
      { message: "CRUD de usuário", changelogId: 1 },
      { message: "CRUD de transações", changelogId: 1 },
      { message: "CRUD de ativos", changelogId: 1 },
      { message: "Login e Cadastro de usuário", changelogId: 1 },
      { message: "Integração com API do Yahoo para consulto de preço atual de ativos", changelogId: 2 },
      { message: "Autenticação e variáveis de contexto", changelogId: 2 },
      { message: "Seção de Dashboard com gráficos", changelogId: 2 },
      { message: "Changelog ao login", changelogId: 2 },
      { message: "Variação por ativo", changelogId: 3 },
      { message: "Interface e tratamento para tipos de ativo", changelogId: 3 },
      { message: "Tipo de ativos 'Outros' para cadastro de ativo personalizado", changelogId: 3 },
      { message: "Nova feature: Calculadora de Alocação de Ativos", changelogId: 4 },
      { message: "Novo Design para plataforma com Landing Page e Sobre adicionados", changelogId: 4 },
      { message: "Melhoria significativa de desempenho ao carregar as transações", changelogId: 4 },
      { message: "Aperfeiçoamento do frontend", changelogId: 4 },
      { message: "Feature de Metas", changelogId: 5 },
      { message: "Feature de Suporte e Perfil do Usuário", changelogId: 5 },
    ];

    for (const change of changes) {
      const existingChange = await prisma.change.findFirst({
        where: { message: change.message, changelogId: change.changelogId },
      });

      if (!existingChange) {
        await prisma.change.create({ data: change });
        console.log(`Mudança "${change.message}" criada com sucesso para a sprint ${change.changelogId}!`);
      } else {
        console.log(`Mudança "${change.message}" já existe no banco de dados.`);
      }
    }
  }

  // Popular critérios para calculadora de distibuição de ativos
  async function critériosCalculadoraDistribuiçãoAtivos() {
    const perguntasIniciais = [
      { criterio: 'Desempenho Financeiro', texto: 'A empresa possui um DY (dividend yield) acima de 6%?' },
      { criterio: 'Desempenho Financeiro', texto: 'A empresa possui um ROE (Retorno Sobre Patrimônio Líquido) acima de 10%?' },
      { criterio: 'Desempenho Financeiro', texto: 'A empresa possui dívida menor que patrimônio?' },
      { criterio: 'Crescimento', texto: 'A empresa apresentou crescimento de receita comparado ao ano anterior?' },
      { criterio: 'Distribuição de Dividendos', texto: 'A empresa aumentou o pagamento de dividendos em relação ao mesmo período do ano anterior?' },
      { criterio: 'Avançar', texto: 'Gostaria de pular a análise deste ativo? Essa opção adiciona 1 ponto para o ativo na calculadora.' },
    ];

    for (const pergunta of perguntasIniciais) {
      const existingPergunta = await prisma.pergunta.findFirst({
        where: { criterio: pergunta.criterio, texto: pergunta.texto },
      });

      if (!existingPergunta) {
        await prisma.pergunta.create({ data: pergunta });
        console.log(`Pergunta "${pergunta.texto}" criada com sucesso!`);
      } else {
        console.log(`Pergunta "${pergunta.texto}" já existe no banco de dados.`);
      }
    }
  }

  async function populateRentabilidade(userCpf: string) {
    const mockRentabilidadeData = [
      { month: '08/23', carteira: 3.0, cdi: 13.53, ibovespa: 5.32 },
      { month: '09/23', carteira: 5.0, cdi: 13.42, ibovespa: 5.87 },
      { month: '10/23', carteira: 7.0, cdi: 13.42, ibovespa: 2.63 },
      { month: '11/23', carteira: 12.0, cdi: 13.04, ibovespa: 9.85 },
      { month: '12/23', carteira: 9.0, cdi: 13.04, ibovespa: 16.55 },
      { month: '01/24', carteira: 19.0, cdi: 13.04, ibovespa: 16.36 },
      { month: '02/24', carteira: 18.0, cdi: 12.7, ibovespa: 15.52 },
      { month: '03/24', carteira: 17.0, cdi: 12.7, ibovespa: 14.54 },
      { month: '04/24', carteira: 16.0, cdi: 12.0, ibovespa: 13.25 },
      { month: '05/24', carteira: 15.0, cdi: 11.75, ibovespa: 13.66 },
      { month: '06/24', carteira: 13.0, cdi: 11.0, ibovespa: 13.32 },
      { month: '07/24', carteira: 14.0, cdi: 11.75, ibovespa: 12.39 },
    ];

    for (const rentabilidade of mockRentabilidadeData) {
      const existingRentabilidade = await prisma.rentabilidade.findFirst({
        where: {
          userCpf,
          month: rentabilidade.month,
        },
      });

      if (!existingRentabilidade) {
        await prisma.rentabilidade.create({
          data: {
            ...rentabilidade,
            userCpf,
          },
        });
        console.log(`Rentabilidade do mês "${rentabilidade.month}" criada com sucesso para o usuário "${userCpf}"!`);
      } else {
        console.log(`Rentabilidade do mês "${rentabilidade.month}" já existe no banco de dados.`);
      }
    }
  }

  const tipos = await createTiposAtivo();
  const user1 = await createTestAccount('12345678901', 'João', 'teste@gmail.com');
  const user2 = await createTestAccount('09876543210', 'Maria', 'teste2@gmail.com');
  const ativosCriados = await createFakeAtivos(tipos);

  await createFakeTransactions(user1, ativosCriados);
  await createFakeTransactions(user2, ativosCriados);

  await populateRentabilidade(user1.cpf);
  await populateRentabilidade(user2.cpf);

  await populateChangelog();

  await critériosCalculadoraDistribuiçãoAtivos();

  console.log("Banco de dados populado com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
