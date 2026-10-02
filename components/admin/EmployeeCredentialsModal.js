"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Modal from "@/components/ui/Modal";
import Input, { Field } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { showToast } from "@/store/slices/uiSlice";
import { employeeService } from "@/services/employeeService";
import { updateEmployeeEmailInStore } from "@/store/slices/organizationSlice";

export default function EmployeeCredentialsModal({ open, onClose, employee }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (employee) setEmail(employee.email);
        setPassword("");
        setError("");
    }, [employee, open]);

    if (!employee) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        if (password && password.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }
        setSubmitting(true);
        try {
            await employeeService.updateEmployeeCredentials(employee.id, {
                email,
                password: password || undefined,
            });
            dispatch(updateEmployeeEmailInStore({ id: employee.id, email }));
            dispatch(showToast({ message: `Login details updated for ${employee.name}.` }));
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Couldn't update credentials.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={`Change login — ${employee.name}`} size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Login email" htmlFor="cred-email" required>
                    <Input id="cred-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="New password" htmlFor="cred-password" hint="Leave blank to keep their current password.">
                    <Input id="cred-password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep unchanged" />
                </Field>

                {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-500">{error}</p>}

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="accent" loading={submitting}>Save Changes</Button>
                </div>
            </form>
        </Modal>
    );
}