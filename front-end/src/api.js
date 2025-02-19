import axios from "axios";

const eventsphereApi = axios.create({
  baseURL: `${process.env.VITE_API_URL}/api`,
});

export function registerNewUser(name, email, password) {
  return eventsphereApi.post("/users", { name, email, password }).then(({ data }) => {
    console.log(data);
    return data;
  });
}
