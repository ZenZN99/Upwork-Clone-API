export const BACKEND_URL = "http://localhost:8000";

export const signup = async (
  fullname: string,
  email: string,
  password: string,
  role: string,
) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fullname, email, password, role }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const me = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const updateAvatar = async (avatar: string) => {
  const formData = new FormData();
  if (avatar) formData.append("avatar", avatar);
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/update/avatar`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/users`, {
      method: "GET",

      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/user/${id}`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/user/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};
