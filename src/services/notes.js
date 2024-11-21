import axios from "axios";
const baseUrl = "/api/notes"; // baseUrl is the base URL of the notes endpoint

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// getAll function is used to get all the notes from the server
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// create function is used to add a new note to the server
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

// update function is used to update the importance of a note
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  update,
  setToken,
};
