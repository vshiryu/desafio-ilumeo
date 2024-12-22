import axios from "axios";

export async function startShiftAction(userId: number) {
  const apiHost = process.env.API_HOST || "http://localhost:3001";
  try {
    const response = await axios.post(`${apiHost}/shifts`, {
      user_id: userId,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response?.data?.message);
    }
    
    throw new Error("Erro ao iniciar o turno.");
  }
}
