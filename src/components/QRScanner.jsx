import React from "react";
import { useNavigate } from "react-router-dom";
import QrReader from "react-qr-reader";

export default function QRScanner() {
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      // If QR encodes a path like /status/123 or just id
      if (data.startsWith("http")) {
        // Try to extract path
        try {
          const u = new URL(data);
          navigate(u.pathname);
        } catch {}
      } else if (data.includes("/status/")) {
        navigate(
          data.split("/status/").pop()
            ? `/status/${data.split("/status/").pop()}`
            : "/"
        );
      } else {
        // assume it's id
        navigate(`/status/${data}`);
      }
    }
  };

  const handleError = (err) => console.error(err);

  return (
    <div className="max-w-md mx-auto">
      <h3 className="font-semibold mb-4">Scan QR</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <QrReader
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
