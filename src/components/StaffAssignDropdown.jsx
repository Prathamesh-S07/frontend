import React, { useEffect, useState } from "react";
import { fetchAllStaff, assignStaffToCounter } from "../api";

const StaffAssignDropdown = ({ counter, onAssigned }) => {
  const [staffList, setStaffList] = useState([]);
  const [selected, setSelected] = useState(counter.assignedStaff?.id || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const staff = await fetchAllStaff();
      setStaffList(staff || []);
    })();
  }, []);

  const handleAssign = async (e) => {
    const staffId = e.target.value;
    setSelected(staffId);
    setLoading(true);
    await assignStaffToCounter(counter.id, staffId);
    setLoading(false);
    onAssigned && onAssigned();
  };

  return (
    <select
      className="clist-select"
      value={selected}
      onChange={handleAssign}
      disabled={loading}
    >
      <option value="">-- Assign Staff --</option>
      {staffList.map((s) => (
        <option key={s.id} value={s.id}>
          {s.username}
        </option>
      ))}
    </select>
  );
};

export default StaffAssignDropdown;
