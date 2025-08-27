import React from "react";
import StaffAssignDropdown from "./StaffAssignDropdown";
import "../styles/CounterList.css";

const CounterList = ({ counters, onDelete, onStaffAssigned }) => {
  return (
    <div className="clist">
      {counters.map((c) => (
        <div className="clist-row" key={c.id}>
          <div className="clist-name">
            {/* Staff select above and close to counter name */}
            <div
              style={{
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            ></div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <strong>{c.name}</strong>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StaffAssignDropdown counter={c} onAssigned={onStaffAssigned} />
                {c.assignedStaff && (
                  <span style={{ color: "#1859bc", fontWeight: 600 }}>
                    Assigned: {c.assignedStaff.username}
                  </span>
                )}
              </div>
            </div>
            <span className="clist-limit-remaining">
              <span className="clist-limit">Limit: {c.dailyLimit}</span>
              <span className="clist-remaining">
                Waiting: {typeof c.waiting === "number" ? c.waiting : 0}
              </span>
            </span>
          </div>
          <button className="clist-del" onClick={() => onDelete(c.id)}>
            Delete
          </button>
        </div>
      ))}
      {!counters?.length && (
        <div className="clist-empty">No counters created yet.</div>
      )}
    </div>
  );
};

export default CounterList;
