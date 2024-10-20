export const checkAuth = () => {
    let isAuthenticated = false;
    let token = document.cookie
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("authtoken="))
          .split("=")[1]
      : undefined;
  
      console.log(document.cookie);
      console.log("token",token)
      
    if (token !== undefined && token.length > 1) {
      isAuthenticated = true;
    }
    return isAuthenticated;
  };