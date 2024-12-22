"use server";

import axios from "axios";

interface UserData {
  name: string;
  email: string;
  password: string;
}

export async function createUserAction(data: UserData) {
    const apiHost = process.env.API_HOST || "http://localhost:3001";
  
    try {
      const response = await axios.post(`${apiHost}/users`, data);
      return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Erro ao criar usuário");
    }
  }
  
