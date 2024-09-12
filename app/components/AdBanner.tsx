import React, { useEffect } from 'react';

const AdBanner: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/ads/ad-script.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="ad-banner">
      {/* Add more ad-related content here if needed */}
      <p>Ads/Adverts here</p>
    </div>
  );
};

export default AdBanner;
