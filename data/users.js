export const users = [
  {
    id: "user_admin",
    name: "Anita Desai",
    email: "admin@acme.com",
    password: "password123",
    role: "admin",
    organizationId: "org_acme",
    avatarColor: "#15171C",
  },
  {
    id: "user_emp_rahul",
    name: "Rahul Sharma",
    email: "rahul@acme.com",
    password: "password123",
    role: "employee",
    employeeId: "emp_1",
    organizationId: "org_acme",
    avatarColor: "#B08D3F",
  },
];

export function findUserByEmail(email) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}
