export const isBusinessLoggedIn = () => {
    const Business_token = localStorage.getItem("Business token");

    if (Business_token === null) {
      return false;
    } else {
      return true;
    }
}

export const isStaffLoggedIn = () => {
    const Staff_token = localStorage.getItem("Staff token");

    if (Staff_token === null) {
      return false;
    } else {
      return true;
    }
}


