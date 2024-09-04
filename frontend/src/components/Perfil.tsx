import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { user } from "../types/user";
import { getUserInfo, deleteUser, updateUserInfo } from "../services/api";
import { AuthContext } from "../state/AuthProvider";
import formataTelefone from "../utils/formataTelefone";

function Perfil() {
  const { session } = useContext(AuthContext);
  const navigate = useNavigate();
  const [user, setUser] = useState<user | undefined>(undefined);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async (session: string) => {
      const userInfo = await getUserInfo(session);
      setUser(userInfo);
    };
    fetchInfo(session);
  }, [session]);

  /*Para exibição do modal de confirmação de deleção de conta*/
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  /*Para exibição do modal de troca de senha*/
  const handleShowPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
  };

  // Função para confirmar a deleção da conta
  const handleDeleteAccount = () => {
    const deleteUserInfo = async (cpf: string) => {
      await deleteUser(cpf);
    };
    if (user) {
      deleteUserInfo(user.cpf);
      navigate("/login");
      handleClose();
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      setPasswordError("A senha deve possuir ao menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("As senhas não coincidem!");
      return;
    }
    if (user) {
      await updateUserInfo(session, { ...user, password: newPassword });
      handleClosePasswordModal();
      window.location.reload();
    }
  };

  // Função para iniciar a edição de um campo
  const handleEdit = (field: string) => {
    setEditingField(field);
    if (user) {
      switch (field) {
        case "name":
          setTempValue(user.name);
          break;
        case "lastName":
          setTempValue(user.lastName);
          break;
        case "email":
          setTempValue(user.email);
          break;
        case "phone":
          setTempValue(user.phone);
          break;
        default:
          break;
      }
    }
  };

  // Função para salvar o valor editado
  const handleSave = async () => {
    if (user && editingField) {
      const updatedUser = { ...user };
      switch (editingField) {
        case "name":
          updatedUser.name = tempValue;
          break;
        case "lastName":
          updatedUser.lastName = tempValue;
          break;
        case "email":
          updatedUser.email = tempValue;
          break;
        case "phone":
          updatedUser.phone = tempValue;
          break;
        default:
          break;
      }
      await updateUserInfo(session, updatedUser);
      setEditingField(null);
      window.location.reload();
    }
  };

  // Função para cancelar a edição
  const handleCancel = () => {
    setEditingField(null);
  };

  return (
    <div>
      {user ? (
        <Container className="mt-5">
          <h1 className="textBlue mt-5 mb-5">Sua conta</h1>
          <Row>
            <Col md={6}>
              <h4>Suas informações</h4>
              <hr />
              <div className="mb-4">
                <strong>Nome</strong>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  {editingField === "name" ? (
                    <>
                      <Form.Control
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                      <Button variant="success" onClick={handleSave}>
                        Salvar
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>{user.name}</p>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEdit("name")}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <strong>Sobrenome</strong>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  {editingField === "lastName" ? (
                    <>
                      <Form.Control
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                      <Button variant="success" onClick={handleSave}>
                        Salvar
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>{user.lastName}</p>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEdit("lastName")}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <strong>Email</strong>
                <div className="d-flex justify-content-between mt-2">
                  {editingField === "email" ? (
                    <>
                      <Form.Control
                        type="email"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                      <Button variant="success" onClick={handleSave}>
                        Salvar
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>{user.email}</p>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEdit("email")}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <strong>Telefone</strong>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  {editingField === "phone" ? (
                    <>
                      <Form.Control
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                      />
                      <Button variant="success" onClick={handleSave}>
                        Salvar
                      </Button>
                      <Button variant="secondary" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>{formataTelefone(user.phone)}</p>
                      <Button
                        variant="outline-primary"
                        onClick={() => handleEdit("phone")}
                      >
                        Editar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Col>

            <Col md={6}>
              <h4>Opções</h4>
              <hr />
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <strong>Segurança</strong>
                  <Button
                    variant="outline-primary"
                    className="d-block mt-2"
                    onClick={handleShowPasswordModal}
                  >
                    Mudar Senha
                  </Button>
                </div>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <strong>Remoção</strong>
                  <Button
                    variant="outline-danger"
                    className="d-block mt-2"
                    onClick={handleShow}
                  >
                    Deletar conta
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          {/*Modal de confirmação de deleção de conta*/}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Deleção de Conta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Tem certeza que deseja deletar sua conta? Essa ação não pode ser
              desfeita.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount}>
                Deletar Conta
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de Troca de Senha */}
          <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
            <Modal.Header closeButton>
              <Modal.Title>Mudar Senha</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formNewPassword">
                  <Form.Label>Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirme a Nova Senha</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>
                {passwordError && (
                  <p style={{ color: "red" }}>{passwordError}</p>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClosePasswordModal}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handlePasswordChange}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}

export default Perfil;
