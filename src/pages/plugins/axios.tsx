import axios from "axios";

axios.defaults.baseURL = "https://api.gackkons.06222001.xyz/";
axios.defaults.headers.post["Content-Type"] = "application/json";


export default axios;
