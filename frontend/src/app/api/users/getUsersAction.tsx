"use server";

import axios from "axios";

export async function getUsersAction() {
  const apiHost = process.env.API_HOST || "localhost:3001";

  try {
    const response = await axios.get(`${apiHost}/users`)
    return response.data
  } catch (error: any) {
        throw new Error(error.response?.data?.message || "Erro ao listar usuários")
    }
}
