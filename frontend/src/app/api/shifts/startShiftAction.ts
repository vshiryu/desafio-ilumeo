import axios from "axios";

interface ShiftData {
  user_id: number;
}

export async function startShiftAction(userId: number) {
  const apiHost = process.env.API_HOST || "http://localhost:3001";
  try {
    const response = await axios.post(`${apiHost}/shifts`, {
      user_id: userId,
    });
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message)
  }
}
