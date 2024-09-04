import React, { useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { createUser } from "../services/api";
import { user } from "../types/user";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<user>();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<user> = async (data) => {
    const formattedData = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ""),
      phone: data.phone.replace(/\D/g, ""),
    };

    try {
      console.log("Dados do formulário formatados:", formattedData);
      await createUser(formattedData);
      console.log("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      setError("CPF ou e-mail já cadastrados");
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao cadastrar usuário:",
          error.response?.data || error.message
        );
        console.error("Detalhes do erro:", error.response?.data?.details);
      } else {
        console.error("Erro ao cadastrar usuário:", (error as Error).message);
      }
    }
  };

  return (
    <section style={{ backgroundColor: "rgb(217, 234, 253, 0.4)" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6">
            <h3 className="textBlue">Cadastre-se</h3>
            <div
              className="card shadow-lg p-20"
              style={{ backgroundColor: "#a3ceef" }}
            >
              <div className="card-body p-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-2">
                    <label htmlFor="cpf" className="form-label textBlue">
                      CPF
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="cpf"
                      {...register("cpf", {
                        required: true,
                        pattern: /^\d{11}$/,
                      })}
                    />
                    {errors.cpf && (
                      <span className="text-danger">
                        Campo obrigatório ou formato inválido
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="nome" className="form-label textBlue">
                      Nome
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="nome"
                      {...register("name", { required: true })}
                    />
                    {errors.name && (
                      <span className="text-danger">Campo obrigatório</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="sobrenome" className="form-label textBlue">
                      Sobrenome
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="sobrenome"
                      {...register("lastName", { required: true })}
                    />
                    {errors.lastName && (
                      <span className="text-danger">Campo obrigatório</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="email" className="form-label textBlue">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <span className="text-danger">Campo obrigatório</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="senha" className="form-label textBlue">
                      Senha
                    </label>
                    <input
                      type="password"
                      autoComplete="on"
                      className="form-control form-control-lg"
                      id="senha"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                    />
                    {errors.password && (
                      <span className="text-danger">
                        Campo obrigatório ou senha muito curta
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="telefone" className="form-label textBlue">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="telefone"
                      {...register("phone", {
                        required: true,
                        pattern: /^\d{11}$/,
                      })}
                    />
                    {errors.phone && (
                      <span className="text-danger">
                        Campo obrigatório ou formato inválido
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <Link to="/login" className="btn btn-link p-0">
                      Já possui uma conta? Entrar
                    </Link>
                  </div>

                  <div className="text-center">
                    <div>
                      <button
                        type="submit"
                        className="btn bg-light btn-lg text-center"
                        style={{
                          color: "#004055",
                          fontWeight: 900,
                          textAlign: "center",
                        }}
                      >
                        CADASTRAR
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

export default Register;
