"use client"

import { useState } from "react";
import { createUserAction } from "../api/users/createUserAction";

interface ModalProps {
  onClose: () => void;
  refreshUsers: () => void;
}

const Modal = ({ onClose, refreshUsers }: ModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateFields = () => {
    if (!name.trim()) return "O nome é obrigatório.";
    if (!email.trim() || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return "Email inválido.";
    if (!password.trim() || password.length < 6)
      return "A senha deve ter pelo menos 6 caracteres.";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createUserAction({ name, email, password });
      refreshUsers();
      onClose();
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Erro ao criar o usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className="modal d-block bg-opacity-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={handleBackgroundClick}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fs-4">Criar Novo Usuário</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Fechar"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body" onKeyPress={handleKeyPress}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control mb-3"
              placeholder="Nome do Usuário"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-3"
              placeholder="Email do Usuário"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control mb-3"
              placeholder="Senha do Usuário"
              required
            />
          </div>
          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
