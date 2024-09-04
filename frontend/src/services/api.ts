import axios from "axios";
import { transaction, transactionSubmit } from "../types/transaction";
import { ativo } from "../types/ativo";
import { user } from "../types/user";
import { change } from "../types/change";
import { tipo_ativo, submit_tipo_ativo } from "../types/tipo_ativo";
import { quotes } from "../types/quotes";
import { pergunta, CreatePerguntaDto } from "../types/pergunta";
import { respostaAtivo } from "../types/respostaAtivo";
import { meta } from "../types/metas";
import { report } from "../types/report";

const api = axios.create({
  baseURL: "http://localhost:4466/v1",
  withCredentials: true,
});

interface LoginDto {
  email: string;
  password: string;
}

//transactions
export const fetchTransactions = (): Promise<transaction[]> =>
  api.get("/transaction").then((response) => response.data);
export const createTransaction = (data: transactionSubmit) =>
  api.post("/transaction", data);
export const getTransaction = (id: string): Promise<transaction> =>
  api.get(`/transaction/${id}`).then((response) => response.data);
export const updateTransaction = (id: string, data: transactionSubmit) =>
  api.put(`/transaction/${id}`, data);
export const deleteTransaction = (id: string) =>
  api.delete(`/transaction/${id}`);
export const fetchUserTransactions = (cpf:string) =>
  api.get(`/transaction/transaction_ativo/${cpf}`).then((response) => response.data);

// ativos
export const fetchAtivos = (): Promise<ativo[]> =>
  api.get("/ativo").then((response) => response.data);
export const getAtivo = (ativoCode: string): Promise<ativo> =>
  api.get(`/ativo/${ativoCode}`).then((response) => response.data);
export const createAtivo = (data: ativo) => api.post("/ativo", data);
export const getAtivoOutros = (): Promise<ativo[]> =>
  api.get("/ativo/outros/find").then((response) => response.data);
//tipo_ativo
export const fetchTipoAtivos = () => api.get("/tipo_ativo");
export const getTipoAtivo = (ativoCode: string): Promise<tipo_ativo> =>
  api.get(`/tipo_ativo/${ativoCode}`).then((response) => response.data);
export const createTipoAtivo = (data: submit_tipo_ativo) =>
  api.post("/tipo_ativo", data);

// user
export const createUser = (data: user) =>
  api.post("/signup", data).then((response) => response.data);
export const getUser = (data: LoginDto): Promise<string> =>
  api.post("/login/", data).then((response) => response.data);
export const logout = () => api.post("/logout");
export const authService = (): Promise<boolean> =>
  api.get("/checkAuth").then((response) => response.data);
export const getUserInfo = (cpf:string) => 
  api.get(`/user/${cpf}`).then((response) => response.data);
export const deleteUser = (cpf: string) =>
  api.delete(`/user/${cpf}`);
export const updateUserInfo = (cpf: string, data:user) => 
  api.put(`/user/${cpf}`, data);

//change
export const getChanges = (id: number): Promise<change[]> =>
  api.get(`/change/${id}`).then((response) => response.data);

// api de cotações
export const setStockQuote = (cpf: string) =>
  api.post(`/stockQuote/setQuotes`, { cpf });
export const setQuoteLabel = (label: string) =>
  api.get(`/stockQuote/setQuoteLabel/${label}`);
export const getQuotes = (cpf: string): Promise<quotes> =>
  api.post(`/stockQuote/getQuotes`, { cpf }).then((response) => response.data);
export const getQuoteLabel = (label: string) =>
  api.get(`/stockQuote/getQuoteLabel/${label}`).then((response) => response.data);


// pergunta
export const fetchPerguntas = (): Promise<pergunta[]> =>
  api.get("/pergunta").then((response) => response.data);
export const createPergunta = (data: CreatePerguntaDto) => api.post('/pergunta', data);
export const updatePergunta = (id: number, data: pergunta) => api.put(`/pergunta/${id}`, data);
export const deletePergunta = (id: number) => api.delete(`/pergunta/${id}`);

// resposta_ativo
export const fetchRespostasAtivoByAtivo = (ativoCodigo: string): Promise<respostaAtivo[]> =>
  api.get(`/resposta_ativo?where={"ativoCodigo":"${ativoCodigo}"}`).then((response) => response.data);
export const fetchRespostasAtivo = (): Promise<respostaAtivo[]> =>
  api.get("/resposta_ativo").then((response) => response.data);
export const createRespostaAtivo = (data: respostaAtivo) => api.post('/resposta_ativo', data);
export const updateRespostaAtivo = (ativoCodigo: string, perguntaId: number, data: { resposta: boolean }) =>
  api.patch(`/resposta_ativo/${ativoCodigo}/${perguntaId}`, data);
export const deleteRespostaAtivo = (ativoCodigo: string, perguntaId: number) =>
  api.delete(`/resposta_ativo/${ativoCodigo}/${perguntaId}`);

// Metas
export const fetchMetas = () => 
  api.get("/meta/getMetas").then((response) => response.data);
export const createMeta = (data: meta) =>
  api.post("/meta/createMeta", data);
export const deleteMeta = (nomeMeta: string) =>
  api.post("/meta/delete", { nomeMeta });
export const updateMeta = (data: meta) =>
  api.put("/meta/update", data);

//suporte
export const createReport = (data: report) =>
  api.post("/report", data);

//rentabilidade
export const getUserRentabilidade = (cpf: string) => 
  api.get(`/rentabilidade/${cpf}`).then((response) => response.data);

export default api;