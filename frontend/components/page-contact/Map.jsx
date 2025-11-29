'use client';
import React, { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function Map() {
  const [map, setMap] = useState(null);

  useEffect(() => {
    fetchMap();
  }, []);

  const fetchMap = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact-map`);
      const data = await response.json();
      if (data.success && data.data) {
        setMap(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact map:', error);
    }
  };

  if (!map || !map.iframeCode) {
    return (
      <div className="google-map">
        <iframe
          id="gmap_canvas"
          src="https://maps.google.com/maps?q=hollwood&t=&z=11&ie=UTF8&iwloc=&output=embed"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="google-map" dangerouslySetInnerHTML={{ __html: map.iframeCode }} />
  );
}

export default Map;
