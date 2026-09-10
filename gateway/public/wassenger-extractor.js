/**
 * Wassenger 1-Click Live Data & UI Extractor
 * Run this in Google Chrome Console on https://console.wassenger.com or https://app.wassenger.com
 */
(async function runWassengerExtractor() {
  console.log('%c🚀 Wassenger 1-Click Extractor Initialized...', 'color: #10b981; font-weight: bold; font-size: 14px;');

  // Create UI overlay banner
  const banner = document.createElement('div');
  banner.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 999999; background: #164e87; color: white; padding: 16px 24px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: sans-serif; font-size: 13px; max-width: 380px; border: 2px solid #38bdf8;';
  banner.innerHTML = `
    <div style="display:flex; align-items:center; gap: 10px; margin-bottom: 8px;">
      <span style="font-size: 18px;">⚡</span>
      <b style="font-size: 14px;">Syncing Wassenger to Localhost...</b>
    </div>
    <div id="syncProgressText" style="color: #bae6fd; font-size: 12px;">Detecting API credentials...</div>
  `;
  document.body.appendChild(banner);

  function updateStatus(text) {
    const el = document.getElementById('syncProgressText');
    if (el) el.innerText = text;
    console.log(`[Wassenger Sync] ${text}`);
  }

  // 1. Search for Auth Token in localStorage / sessionStorage
  let token = null;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const val = localStorage.getItem(key);
    if (/token|auth|key|session/i.test(key) && val && val.length > 20) {
      token = val.replace(/["']/g, '');
      break;
    }
  }

  if (!token) {
    // Check cookies
    const match = document.cookie.match(/(?:token|auth|session)=([^;]+)/);
    if (match) token = match[1];
  }

  updateStatus(token ? 'Authentication token found! Fetching data...' : 'Using public session data...');

  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }

  const exportData = {
    timestamp: new Date().toISOString(),
    token: token || null,
    origin: window.location.origin,
    devices: [],
    labels: [],
    quickReplies: [],
    webhooks: [],
    team: [],
    uiStyles: {
      primaryColor: '#164e87',
      accentColor: '#10b981',
      brand: 'Wassenger'
    }
  };

  // 2. Fetch Devices
  try {
    updateStatus('Fetching connected devices...');
    const res = await fetch('https://api.wassenger.com/v1/devices', { headers });
    if (res.ok) {
      exportData.devices = await res.json();
    }
  } catch (e) {}

  // 3. Fetch Webhooks
  try {
    updateStatus('Fetching webhooks...');
    const res = await fetch('https://api.wassenger.com/v1/webhooks', { headers });
    if (res.ok) {
      exportData.webhooks = await res.json();
    }
  } catch (e) {}

  // 4. Fetch per-device data (labels, quick replies)
  if (exportData.devices && exportData.devices.length > 0) {
    for (const dev of exportData.devices) {
      const devId = dev.id;
      try {
        updateStatus(`Fetching labels for device ${dev.name || devId}...`);
        const lRes = await fetch(`https://api.wassenger.com/v1/devices/${devId}/labels`, { headers });
        if (lRes.ok) {
          const lbs = await lRes.json();
          if (Array.isArray(lbs)) exportData.labels.push(...lbs);
        }

        updateStatus(`Fetching quick replies for device ${dev.name || devId}...`);
        const qRes = await fetch(`https://api.wassenger.com/v1/devices/${devId}/quickReplies`, { headers });
        if (qRes.ok) {
          const qrs = await qRes.json();
          if (Array.isArray(qrs)) exportData.quickReplies.push(...qrs);
        }
      } catch (e) {}
    }
  }

  // 5. Send data to Localhost Platform
  updateStatus('Pushing configuration to http://localhost:3000...');
  try {
    const pushRes = await fetch('http://localhost:3000/api/v1/sync/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exportData)
    });

    if (pushRes.ok) {
      const result = await pushRes.json();
      banner.style.background = '#065f46';
      banner.style.borderColor = '#34d399';
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap: 10px;">
          <span style="font-size: 20px;">✅</span>
          <div>
            <b style="font-size: 14px;">Sync Complete!</b>
            <div style="font-size: 12px; color: #a7f3d0; margin-top: 4px;">
              ${result.message || 'Data successfully imported to localhost:3000'}
            </div>
          </div>
        </div>
      `;
      setTimeout(() => banner.remove(), 8000);
      return;
    }
  } catch (err) {
    console.warn('Could not post directly to localhost:3000 (likely due to mixed content or CORS). Downloading JSON backup instead...');
  }

  // Fallback: Trigger JSON file download
  updateStatus('Downloading wassenger_export.json backup...');
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `wassenger_export_${Date.now()}.json`;
  a.click();

  banner.style.background = '#065f46';
  banner.style.borderColor = '#34d399';
  banner.innerHTML = `
    <div style="display:flex; align-items:center; gap: 10px;">
      <span style="font-size: 20px;">💾</span>
      <div>
        <b style="font-size: 14px;">Data Exported to Downloads!</b>
        <div style="font-size: 11px; color: #a7f3d0; margin-top: 4px;">
          Saved wassenger_export.json. You can upload it in your local dashboard!
        </div>
      </div>
    </div>
  `;
  setTimeout(() => banner.remove(), 8000);
})();
