import React, { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { meta } from "../types/metas";
import { updateMeta } from "../services/api";

const MetaUpdate = () => {
    const navigate = useNavigate();
    const { nome } = useParams<{ nome: string }>()
    const [valor, setValor] = React.useState(0);
    const [data, setData] = React.useState("0000-00-00");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "value") {
            setValor(Number(value));
        }
        if (name === "data") {
            setData(value);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (valor && data) {
                await updateMeta({ nomeMeta: nome, meta: valor, dataMeta: data } as meta);
                navigate("/metas");
            }
        } catch (error) {
            alert("Erro ao atualizar meta!");
            console.error(error);
        }
    };
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card w-50" style={{ backgroundColor: "#D9EAFD" }}>
                <div className="card-body">
                    <h5 className="card-title text-center mb-4">Atualizar Meta</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">{nome}</label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="data" className="form-label">Data Limite</label>
                            <input type="date" className="form-control" id="data" name="data" onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="value" className="form-label">Valor Alvo</label>
                            <input type="number" placeholder="0,00" className="form-control" id="value" name="value" step="0.01" onChange={handleChange} required />
                        </div>
                        <div className="d-flex justify-content-between">
                            <Link to={"/metas"} className="btn btn-secondary">
                                Cancelar
                            </Link>
                            <button type="submit" className="btn btn-primary">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MetaUpdate;