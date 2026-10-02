"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "@/components/ui/Modal";
import Input, { Field } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { showToast } from "@/store/slices/uiSlice";
import { employeeService } from "@/services/employeeService";
import { addEmployee } from "@/store/slices/organizationSlice";

const initialForm = { name: "", role: "", department: "", email: "", password: "" };

export default function AddEmployeeModal({ open, onClose }) {
    const dispatch = useDispatch();
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function update(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function validate() {
        const next = {};
        if (!form.name.trim()) next.name = "Name is required.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email.";
        if (form.password.length < 8) next.password = "At least 8 characters.";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const newEmployee = await employeeService.createEmployee(form);
            dispatch(addEmployee(newEmployee));
            dispatch(showToast({ message: `${form.name} added — they can log in now.` }));
            setForm(initialForm);
            onClose();
        } catch (err) {
            dispatch(
                showToast({
                    message: err.response?.data?.message || err.message || "Couldn't add employee.",
                    type: "error",
                })
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title="Add employee" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Full name" htmlFor="emp-name" required error={errors.name}>
                    <Input id="emp-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Rahul Sharma" error={errors.name} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Role" htmlFor="emp-role">
                        <Input id="emp-role" value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Senior Developer" />
                    </Field>
                    <Field label="Department" htmlFor="emp-department">
                        <Input id="emp-department" value={form.department} onChange={(e) => update("department", e.target.value)} placeholder="Engineering" />
                    </Field>
                </div>
                <Field label="Login email" htmlFor="emp-email" required error={errors.email}>
                    <Input id="emp-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="rahul@acme.com" error={errors.email} />
                </Field>
                <Field label="Temporary password" htmlFor="emp-password" required error={errors.password} hint="Share this with the employee.">
                    <Input id="emp-password" type="text" value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 8 characters" error={errors.password} />
                </Field>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="accent" loading={submitting}>Add Employee</Button>
                </div>
            </form>
        </Modal>
    );
}