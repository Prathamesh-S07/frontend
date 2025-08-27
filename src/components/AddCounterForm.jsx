import React, { useState } from "react";
import "../styles/AddCounterForm.css";

const AddCounterForm = ({ onCreate }) => {
  const [form, setForm] = useState({ name: "", dailyLimit: "" });

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    setForm({ name: "", dailyLimit: "" });
  };

  return (
    <form className="acf" onSubmit={onSubmit}>
      <div className="acf-row">
        <label className="acf-label">
          Name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="acf-input improved-input"
            placeholder="Counter name"
            required
          />
        </label>

        <label className="acf-label">
          Daily Limit
          <input
            name="dailyLimit"
            type="number"
            min="1"
            value={form.dailyLimit}
            onChange={onChange}
            className="acf-input improved-input"
            placeholder="e.g. 100"
            required
          />
        </label>

        <button className="acf-btn" type="submit">
          Add
        </button>
      </div>
    </form>
  );
};

export default AddCounterForm;
