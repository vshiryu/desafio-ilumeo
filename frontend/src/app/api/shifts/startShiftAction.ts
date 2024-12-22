import axios from "axios";

export async function startShiftAction(userId: number) {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
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
