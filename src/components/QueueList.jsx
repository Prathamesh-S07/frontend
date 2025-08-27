import React from "react";

const QueueList = ({ entries = [], onUpdate }) => {
  return (
    <div>
      <h3 className="font-semibold mb-3">Queue Entries</h3>
      <div className="space-y-3">
        {entries.map(e => (
          <div key={e.id} className="flex justify-between items-center p-3 bg-white border rounded-lg shadow-sm">
            <div>
              <div className="font-medium">{e.userName || e.name}</div>
              <div className="text-sm text-gray-500">{new Date(e.joinedTime || e.joinedAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-sm ${e.status === 'Waiting' ? 'bg-yellow-100 text-yellow-800' : e.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {e.status}
              </span>
              <button onClick={() => onUpdate && onUpdate(e.id, 'In Progress')} className="px-3 py-1 bg-indigo-600 text-white rounded">In Progress</button>
              <button onClick={() => onUpdate && onUpdate(e.id, 'Done')} className="px-3 py-1 bg-green-600 text-white rounded">Done</button>
            </div>
          </div>
        ))}
        {entries.length === 0 && <div className="text-gray-500">No entries</div>}
      </div>
    </div>
  );
};

export default QueueList;
