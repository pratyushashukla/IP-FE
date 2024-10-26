export const checkAuth = () => {
    let isAuthenticated = false;
    let token = document.cookie
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("authtoken="))
          .split("=")[1]
      : undefined;
      
    if (token !== undefined && token.length > 1) {
      isAuthenticated = true;
    }
    return isAuthenticated;
  };

  export const formatPhoneNumber = (phoneNumber) => {
    const cleaned = phoneNumber.toString().replace(/\D/g, ""); // Remove all non-numeric characters
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/); // Match the standard US phone format
  
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`; // Format the number
    }
    return null; // Return null if the format is incorrect
  };

  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  