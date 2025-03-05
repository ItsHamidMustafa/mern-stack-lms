import React, { useState, useEffect } from "react";

export const Help = () => {
  const [helps, setHelps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHelps = async () => {
    try {
      const response = await fetch("/api/help/fetch");
      if (!response.ok) {
        throw new Error("Failed to fetch helps");
      }
      const data = await response.json();
      setHelps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelps();
  }, []);

  if (loading) {
    return <div>Loading helps...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="sub-component help-component">
      <span className="font-size-large">Help</span>
      <div className="sub-component-container help-component-container">
        {helps.length === 0 ? (
          <p>No helping materials found.</p>
        ) : (
          <>
            {helps.map((help) => (
              <div key={help._id} className="w-100p">
                <span className="font-size-large">{help.heading}</span>
                <div className="help-card">
                  {help.materials.map((material) => (
                    <div className="schedule-card" key={material.title}>
                      <p>{material.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
