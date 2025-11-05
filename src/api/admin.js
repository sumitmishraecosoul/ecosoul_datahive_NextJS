import api from "./api";

// Create a new user
export const createUser = async ({ name, email, password, department }) => {
  const response = await api.post("/auth/createUser", {
    name,
    email,
    password,
    department,
  });
  return response.data;
};

// Create a new department (backend expects { name })
export const createDepartment = async ({ name, departmentName }) => {
  const response = await api.post("/auth/createDepartment", {
    name: name ?? departmentName,
  });
  return response.data;
};

// Get all departments for dropdowns
export const getAllDepartments = async () => {
  const response = await api.get("/auth/getAllDepartments");
  return response.data;
};

export default {
  createUser,
  createDepartment,
  getAllDepartments,
};


