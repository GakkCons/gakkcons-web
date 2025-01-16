import axios from "axios";

axios.defaults.baseURL = "https://api.gackkons.06222001.xyz/api";
axios.defaults.headers.post["Content-Type"] = "application/json";


export default axios;
