import axios from "axios";
import { AuthHeader } from "../../pages/plugins/axios";
import { RequestAppointmentTypes } from "./teacher.types";

export async function getTeachers(search: string = "") {
  try {
    const authHeader = await AuthHeader();
    const response = await axios.get(
      `teachers?search=${encodeURIComponent(search)}`,
      authHeader
    );
    return [true, response.data];
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "An error occurred.";
    return [false, errorMessage];
  }
}

export async function requestAppointment(data: RequestAppointmentTypes) {
  try {
    const authHeader = await AuthHeader();
    const response = await axios.post("appointments/request", data, authHeader);
    return [true, response.data];
  } catch (error: any) {
    const errorMessage = error.response.data.message;
    return [false, errorMessage];
  }
}
