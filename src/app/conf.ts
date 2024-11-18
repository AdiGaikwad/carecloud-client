import { env } from "process"

interface Domains {
    AUTH_HOST: string;
  }
  

const domains : Domains = {
    AUTH_HOST: "http://developer.adi:5000",
    // PROTOCOL: process.env.NODE_ENV == "development" ? "http://" : "https://"

}

export default domains