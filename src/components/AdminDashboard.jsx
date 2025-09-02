import React, { useEffect, useState } from "react";
import {
  fetchAllQueues,
  fetchAdminCounters,
  createAdminCounter,
  deleteAdminCounter,
  markServed,
  filterQueues,
  downloadQueuesExcel,
} from "../api";
import CounterList from "./CounterList";
import AddCounterForm from "./AddCounterForm";
import AdminManageRoles from "./AdminManageRoles";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [counters, setCounters] = useState([]);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [rolesLoading, setRolesLoading] = useState(false);
  // Filter state
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");
  const [filterCounter, setFilterCounter] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [cList, qList] = await Promise.all([
        fetchAdminCounters(),
        fetchAllQueues(),
      ]);
      setCounters(cList || []);
      setQueues(qList || []);
      setError("");
    } catch (e) {
      if (e.response?.status === 401) {
        setError("Unauthorized — please log in again.");
      } else {
        setError("Error loading data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Filtered load
  const applyFilter = async () => {
    setLoading(true);
    try {
      // Only send startDate/endDate if selected
      const filterParams = {};
      if (filterStart) filterParams.startDate = filterStart;
      if (filterEnd) filterParams.endDate = filterEnd;

      let filtered = await filterQueues(filterParams);

      // Filter by counter and status client-side if selected
      if (filterCounter) {
        filtered = filtered.filter(
          (q) => q.counter && q.counter.id === Number(filterCounter)
        );
      }
      if (filterStatus) {
        filtered = filtered.filter((q) =>
          filterStatus === "waiting" ? !q.served : q.served
        );
      }
      setQueues(filtered);
      setError("");
    } catch (e) {
      setError("Error applying filter.");
    } finally {
      setLoading(false);
    }
  };

  const onDownloadExcel = async () => {
    try {
      const blob = await downloadQueuesExcel({
        startDate: filterStart,
        endDate: filterEnd,
      });
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "queue_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      setError("Failed to download Excel file.");
    }
  };

  useEffect(() => {
    load();
    // Removed auto-refresh interval for optimization
  }, []);

  const onAddCounter = async (payload) => {
    try {
      await createAdminCounter(payload);
      setMsg("Counter created");
      load();
    } catch (e) {
      setError("Failed to create counter.");
    }
  };

  const onDeleteCounter = async (id) => {
    try {
      await deleteAdminCounter(id);
      setMsg("Counter deleted");
      load();
    } catch (e) {
      setError("Failed to delete counter.");
    }
  };

  const onServe = async (id) => {
    try {
      await markServed(id);
      setMsg(`Ticket ${id} marked as served`);
      load();
    } catch (e) {
      setError("Failed to update ticket status.");
    }
  };

  const refreshRoles = async () => {
    setRolesLoading(true);
    // You may want to trigger a reload in AdminManageRoles, e.g. via a ref or callback
    setTimeout(() => setRolesLoading(false), 1000); // Simulate loading
  };

  return (
    <div className="admin-wrap">
      <div className="admin-top-grid">
        <section className="admin-card admin-left">
          <div className="admin-header">
            <h2>Counters</h2>
          </div>
          <div className="admin-add-counter-form-wrap">
            <AddCounterForm onCreate={onAddCounter} />
          </div>
          <CounterList
            counters={counters}
            onDelete={onDeleteCounter}
            onStaffAssigned={load}
          />
        </section>
        <section className="admin-card admin-right">
          <AdminManageRoles loading={rolesLoading} onRefresh={refreshRoles} />
        </section>
      </div>

      <section className="admin-card admin-queues">
        <div className="admin-header">
          <h2>All Queues</h2>
          {!loading && (
            <button
              className="admin-btn"
              style={{ marginLeft: 12 }}
              onClick={load}
            >
              Refresh
            </button>
          )}
          {loading && <span className="admin-pill">Refreshing…</span>}
        </div>

        <div className="admin-filter-bar">
          <label>
            Start Date:
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
            />
          </label>
          <label>
            Counter:
            <select
              value={filterCounter}
              onChange={(e) => setFilterCounter(e.target.value)}
            >
              <option value="">All</option>
              {counters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status:
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="waiting">Waiting</option>
              <option value="served">Served</option>
            </select>
          </label>
          <button
            className="admin-btn"
            onClick={applyFilter}
            style={{ marginLeft: 8 }}
          >
            Apply Filter
          </button>
          <button
            className="admin-btn"
            onClick={onDownloadExcel}
            style={{ marginLeft: 8 }}
          >
            Download as Excel
          </button>
        </div>

        {error && <div className="admin-toast error">{error}</div>}

        <div className="admin-table">
          <div className="admin-row admin-row-head">
            <div>ID</div>
            <div>Name</div>
            <div>Counter</div>
            <div>Joined</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {queues.map((q) => (
            <div className="admin-row" key={q.id}>
              <div>{q.id}</div>
              <div>{q.userName || "-"}</div>
              <div>{q?.counter?.name || "-"}</div>
              <div>
                {q.joinedAt ? new Date(q.joinedAt).toLocaleString() : "-"}
              </div>
              <div>
                <span className={`admin-badge ${q.served ? "ok" : "wait"}`}>
                  {q.served ? "Served" : "Waiting"}
                </span>
              </div>
              <div>
                {!q.served && (
                  <button className="admin-btn" onClick={() => onServe(q.id)}>
                    Mark Served
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {msg && <div className="admin-toast">{msg}</div>}
    </div>
  );
};

export default AdminDashboard;
