"use server"
import axios from "axios";

export const endShiftAction = async (userId: number) => {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  try {
    const response = await axios.patch(`${apiHost}/shifts/end-shift/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar turnos:", error);
    throw new Error("Erro ao carregar turnos do usuário");
  }
};
