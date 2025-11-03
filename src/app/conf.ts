
interface Domains {
    AUTH_HOST: string;
  }
  

const domains : Domains = {
    AUTH_HOST: process.env.NODE_ENV == "development" ? "http://developer.adi:3500" : "https://carecloud-auth.rocketrigs.in/",
    // PROTOCOL: process.env.NODE_ENV == "development" ? "http://" : "https://"

}

export default domains