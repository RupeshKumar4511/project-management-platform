import { redirect } from "react-router-dom";

const generateNewRefreshToken = async () => {
  try {
    const response = await fetch(`${import.meta.env.BACKEND_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": 'application/json' },
      credentials: 'include'
    })
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
const ensureAuth = async () => {

  const customMsg = { message: "Logout Successfully", logout: true };

  try {
    const response = await fetch(`${import.meta.env.BACKEND_URL}/api/v1/auth`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    }

    if (data.message == 'Token expired') {
      const res = await generateNewRefreshToken();
      if (res.code == 'SIGNED_OUT') {
        localStorage.setItem("user", JSON.stringify({ logout: true }));
        return redirect('/')
      } else {
        localStorage.setItem("user", JSON.stringify(res));
        return res;
      }
    }

    localStorage.setItem("user", JSON.stringify(customMsg));
    return redirect('/');

  } catch (error) {
    console.log(error);
    localStorage.setItem("user", JSON.stringify(customMsg));
    return redirect('/');
  }
};

export default ensureAuth