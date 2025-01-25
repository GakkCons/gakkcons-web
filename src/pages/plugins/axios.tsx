import axios from "axios";

const debug = false;

export let backendURL: string;

if (debug) {
  backendURL = "http://localhost:5000";
} else {
  backendURL = "https://api.gackkons.06222001.xyz";
}

axios.defaults.baseURL = `${backendURL}/api/`;
axios.defaults.headers.post["Content-Type"] = "application/json";

export default axios;
