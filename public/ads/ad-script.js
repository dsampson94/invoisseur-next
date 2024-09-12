// Example of a simple ad script
(function() {
    // Configuration for your ad
    const adConfig = {
      adContainerId: 'ad-container',
      adSourceUrl: 'https://example.com/ad-content', // Replace with your ad content URL
      adWidth: 300,
      adHeight: 250
    };
  
    // Create an ad container if it doesn't already exist
    function createAdContainer() {
      const existingContainer = document.getElementById(adConfig.adContainerId);
      if (existingContainer) return;
  
      const container = document.createElement('div');
      container.id = adConfig.adContainerId;
      container.style.width = `${adConfig.adWidth}px`;
      container.style.height = `${adConfig.adHeight}px`;
      container.style.border = '1px solid #ddd'; // Optional styling
      container.style.overflow = 'hidden';
      document.body.appendChild(container);
    }
  
    // Load the ad content
    function loadAdContent() {
      fetch(adConfig.adSourceUrl)
        .then(response => response.text())
        .then(html => {
          const adContainer = document.getElementById(adConfig.adContainerId);
          if (adContainer) {
            adContainer.innerHTML = html;
          }
        })
        .catch(error => {
          console.error('Failed to load ad content:', error);
        });
    }
  
    // Initialize the ad script
    function init() {
      createAdContainer();
      loadAdContent();
    }
  
    // Run the initialization
    init();
  })();
  