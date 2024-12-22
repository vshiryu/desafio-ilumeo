import axios from "axios";

export const getUserShiftsAction = async (userId: number) => {
  const apiHost = process.env.API_HOST || "http://localhost:3001";

  try {
    console.log("get users shift action")
    const response = await axios.get(`${apiHost}/shifts/user/${userId}`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Erro ao carregar turnos:", error);
    throw new Error("Erro ao carregar turnos do usuário");
  }
};
