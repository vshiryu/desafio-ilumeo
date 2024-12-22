"use client"

import { useState, useEffect } from "react";
import { getUsersAction } from "../api/users/getUsersAction";
import { startShiftAction } from "../api/shifts/startShiftAction";
import { endShiftAction } from "../api/shifts/endShiftAction";
import { getUserShiftsAction } from "../api/shifts/getUserShiftsAction";
import Modal from "../components/createUserModal";
import UserShifts from "../components/UserShifts";

const HomePage = () => {
  const [users, setUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [userShifts, setUserShifts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingShift, setLoadingShift] = useState(false);
  const [shiftMessage, setShiftMessage] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getUsersAction();
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = async (user: { id: number; name: string; email: string }) => {
    setSelectedUser(user);
    
    try {
      const shifts = await getUserShiftsAction(user.id);
      setUserShifts(shifts);
    } catch (error) {
      console.error("Erro ao carregar turnos do usuário:", error);
    }
  };

  const handleStartOrEndShift = async () => {
    if (!selectedUser) return;

    setLoadingShift(true);

    try {
      const ongoingShift = userShifts.some((shift: any) => !shift.endTime);

      if (ongoingShift) {
        await endShiftAction(selectedUser.id);
        setShiftMessage("Turno finalizado com sucesso!");
      } else {
        await startShiftAction(selectedUser.id);
        setShiftMessage("Turno iniciado com sucesso!");
      }

      const updatedShifts = await getUserShiftsAction(selectedUser.id);
      setUserShifts(updatedShifts);
    } catch (error: any) {

      if (error.message && error.message === "User already has an ongoing shift") {
        setShiftMessage("Usuário já tem um turno iniciado");
      } else {
        setShiftMessage("Erro ao iniciar ou finalizar o turno.");
      }
      console.error("Erro ao iniciar ou finalizar o turno:", error);
    } finally {
      setLoadingShift(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const refreshUsers = async () => {
    try {
      const usersList = await getUsersAction();
      setUsers(usersList);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center h1 fs-2 fw-bold mb-4">Controle de Ponto Ilumeo</h1>

      <div className="d-flex justify-content-center">
        <button
          onClick={openModal}
          className="btn btn-primary btn-md rounded-3 p-2"
        >
          Criar Usuário
        </button>
      </div>

      <div className="my-4">
        <h3>Usuários cadastrados:</h3>
        <select
          onChange={(e) => 
            handleSelectUser(
              users.find((user) => user.id === parseInt(e.target.value))!
            )
          }
          className="form-select"
          defaultValue=""
        >
          <option value="" disabled>
            Selecione um usuário
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {selectedUser && (
          <div className="mt-4">
            <h4>Informações do Usuário Selecionado:</h4>
            <p>
              <strong>Nome:</strong> {selectedUser.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
          </div>
        )}

        {shiftMessage && (
          <div className={`alert ${shiftMessage.includes("sucesso") ? "alert-success" : "alert-danger"}`}>
            {shiftMessage}
          </div>
        )}

        <button
          onClick={handleStartOrEndShift}
          className="btn btn-success btn-md mt-3"
          disabled={!selectedUser || loadingShift}
        >
          {loadingShift ? "Processando..." : userShifts.some((shift: any) => !shift.endTime) ? "Finalizar Turno" : "Iniciar Turno"}
        </button>

        {userShifts.length > 0 && (
          <UserShifts shifts={userShifts} />
        )}
      </div>

      {isModalOpen && <Modal onClose={closeModal} refreshUsers={refreshUsers} />}
    </div>
  );
};

export default HomePage;
