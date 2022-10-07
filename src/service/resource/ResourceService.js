import http from "../../http-common";

const getResources = (payload) => {
  return http.post(
    `resource`,
    payload
  );
}

export {
  getResources
}
