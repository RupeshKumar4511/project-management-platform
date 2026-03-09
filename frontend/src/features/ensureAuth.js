const generateNewRefreshToken = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/refresh', {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            credentials:'include'
        })
        const data = await response.json();
        return data;
    } catch (error) {
        return error;
    }
}
const  ensureAuth = async () => {
  
  const customMsg = { message: "Logout Successfully", logout: true };

  try {
    const response = await fetch('http://localhost:3000/api/v1/auth', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } else if(data.message == 'Token expired'){
        const res = await generateNewRefreshToken();
        if(res.code == 'SIGNED_OUT'){
          alert("You are Signed out. Please Login to continue");
          window.location.href='/'
          return data;
        }else{
          localStorage.setItem("user", JSON.stringify(res));
        }   
    }
    else {
      localStorage.setItem("user", JSON.stringify(customMsg));
      return customMsg;
    }
  } catch (error) {
    console.log(error);
    localStorage.setItem("user", JSON.stringify(customMsg));
    return customMsg;
  }
};

export default ensureAuth