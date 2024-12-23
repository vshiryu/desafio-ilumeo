"use server";

import axios from "axios";

export async function getUsersAction() {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;

  try {
    const response = await axios.get(`${apiHost}/users`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response?.data?.message || "Erro ao listar usuários");
    }
    
    throw new Error("Erro ao listar usuários.");
  }
}
