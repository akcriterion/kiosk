import http from "../../http-common";

const getCountries = () => {
  return http.get(
    `country`
  );
}

export {
  getCountries,
}
