import http from "../../http-common";
// import { authHeader } from "../auth/auth-header";

const getReservations = (payload) => {
  return http.post(
    `reservation/all`,
    payload
  );
}

const getReservation = (payload) => {
  return http.post(
    `reservation/`,
    payload
  );
}

const updateReservation = (payload) => {

  console.log('PAYLOAD TO SEND:', payload);

  return http.put(
    `reservation/`,
    payload,
    // { headers: authHeader() }
  );
}

export {
  getReservations,
  getReservation,
  updateReservation
}
