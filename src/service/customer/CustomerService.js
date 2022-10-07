import http from "../../http-common";

const getCustomers = (payload) => {
  return http.post(
    `customers/all`,
    payload
  );
}

const getCustomer = (payload) => {
  return http.post(
    `customer/`,
    payload
  );
}

const updateCustomer = (payload) => {

  console.log('PAYLOAD TO SEND:', payload);

  return http.put(
    `customer/`,
    payload,
  );
}

export {
  getCustomers,
  getCustomer,
  updateCustomer
}
