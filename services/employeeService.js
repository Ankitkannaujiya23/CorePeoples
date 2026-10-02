import { api } from "@/lib/api";

export const employeeService = {
  async getEmployees() {
    const res = await api.get("/employees");
    return res.data ?? res;
  },

  async getEmployeeById(id) {
    const res = await api.get(`/employees/${id}`);
    return res.data ?? res;
  },

  async createEmployee({ name, role, department, email, password, blurb, avatarColor }) {
    const res = await api.post("/employees", { name, role, department, email, password, blurb, avatarColor });
    return res.data ?? res;
  },

  async updateEmployee(id, { name, role, department, blurb }) {
    const res = await api.patch(`/employees/${id}`, { name, role, department, blurb });
    return res.data ?? res;
  },

  async setEmployeeStatus(id, isActive) {
    const res = await api.patch(`/employees/${id}/status`, { isActive });
    return res.data ?? res;
  },

  async updateEmployeeCredentials(id, { email, password }) {
    const res = await api.patch(`/employees/${id}/credentials`, { email, password });
    return res.data ?? res;
  },
};