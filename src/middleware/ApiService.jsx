import axios from "axios";

const genericPaths = [
  "/auth/login",
  "/auth/signup",
];

const ApiService = axios.create({
  baseURL: "http://localhost:3000/api/v1/",
  withCredentials: true,
});

//request interceptor
ApiService.interceptors.request.use(
  async (config) => {
    if (!genericPaths.includes(config.url)) {
      config.headers = {
        authtoken: document.cookie
          .split("; ")
          .find((row) => row.startsWith("authtoken="))
          .split("=")[1],
      };
    }
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);

//response interceptor
ApiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401 && error.response.data.message.includes("Session expired")) {
      // Handle session expiration and logout
      const dispatch = useDispatch();
      const navigate = useNavigate();
      dispatch(LOGOUT(navigate));
    }
    return Promise.reject(error);
  }
);

// ApiService.interceptors.response.use(
//   async (response) => {
//     console.log("response", response)
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response.data;
//   },
//   function (error) {
//     if(error.response.status === 400) {
//       alert(error.response.data.message)
//     }
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     // if (error.response.status !== 403) {
//     //   apiCmt.post("/users/login/refresh", { token: refreshToken });
//     // }
//     return Promise.reject(error);
//   }
// );

export const handleNetworkError = (error) => {
  return console.log(error);
};

export const dispatchApiMessage = (dispatch, Action, message) => {
  dispatch(Action(message));
  setTimeout(() => {
    dispatch(Action(""));
  }, 3000);
};

export const dispatchAction = (dispatch, Action, data) => {
  dispatch(Action(data));
};

export default ApiService;
