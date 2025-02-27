import { AuthHeader } from "../../pages/plugins/axios";
import axios from "axios";

export async function getNotifications() {
  try {
    const authHeader = await AuthHeader();
    const response = await axios.get(`notifications`, authHeader);
    return [true, response.data];
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An error occurred.";
    return [false, errorMessage];
  }
}
