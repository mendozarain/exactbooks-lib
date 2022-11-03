import React from 'react'
import axios from "axios";

export const configAxios = () => {

  axios.interceptors.response.use(
    function (response) {
      console.log(response)
      if (response.data) {
        // return success
        if (response.status === 200 || response.status === 201) {
          return response;
        }
        // reject errors & warnings
        return Promise.reject(response);
      }

      // default fallback
      return Promise.reject(response);
    },
    function (error) {
      console.log("test")
      if (error.response.status === 401) {
       
        handleLogout()
       }
      // if the server throws an error (404, 500 etc.)
      return Promise.reject(error);
    }
  );
};

const handleLogout = async () =>{
  console.log("test")
  if (localStorage.getItem("token") === null) {
    localStorage.clear();
    navigate("/login");
  }
 else{
  axios.defaults.headers.common['Authorization'] = `Token ${localStorage.getItem('token')}`
  return axios.request(axios.defaults);
 }
}