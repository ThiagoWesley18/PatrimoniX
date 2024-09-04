import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../state/AuthProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getUser, setStockQuote } from "../services/api";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const id = await getUser(data);
      if (id) setStockQuote(id);
      setAuth(id);
      navigate("/wallet", { state: true });
    } catch (error: Error | any) {
      setError("Usuário ou senha inválidos");
      if (axios.isAxiosError(error)) {
        console.error("Erro ao logar:", error);
        console.error("Detalhes do erro:", error.response?.data?.details);
      } else {
        console.error("Erro ao logar:", (error as Error).message);
      }
    }
  };
  return (
    <section
      className="vh-100"
      style={{ backgroundColor: "rgb(217, 234, 253, 0.4)" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6">
            <h3 className="textBlue">Entrar</h3>
            <div
              className="card shadow-lg"
              style={{ backgroundColor: "#a3ceef", padding: "50px" }}
            >
              <div className="card-body p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div data-mdb-input-init className="form-outline mb-2">
                    <label className="form-label textBlue">
                      Insira seu email
                    </label>
                    <input
                      type="email"
                      id="typeEmailX-2"
                      className="form-control form-control-lg"
                      aria-describedby="email"
                      {...register("email", { required: true })}
                    />
                    {errors.email?.type === "required" && (
                      <span className="text-danger">Campo obrigatório</span>
                    )}
                  </div>

                  <div data-mdb-input-init className="form-outline mb-2">
                    <label className="form-label textBlue">
                      Insira sua senha
                    </label>
                    <input
                      type="password"
                      id="typePasswordX-2"
                      autoComplete="on"
                      className="form-control form-control-lg"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                    />
                    {errors.password?.type === "required" && (
                      <span className="text-danger">Campo obrigatório</span>
                    )}
                    {errors.password?.type === "minLength" && (
                      <span className="text-danger">
                        Minímo de 6 caracteres
                      </span>
                    )}
                  </div>

                  <div className="mb-3 d-flex justify-content-between">
                    <Link to="/register" className="btn btn-link p-0">
                      Não tem conta? Cadastre-se
                    </Link>
                    <Link to="#" className="btn btn-link p-0">
                      Recuperar senha
                    </Link>
                  </div>

                  <div className="text-center">
                    <div>
                      <button
                        data-mdb-button-init
                        data-mdb-ripple-init
                        className="btn bg-light btn-lg text-center"
                        type="submit"
                        style={{ color: "#004055", fontWeight: 900 }}
                      >
                        ENTRAR
                      </button>
                    </div>
                    {error !== "" && (
                      <span className="text-danger">{error}</span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
