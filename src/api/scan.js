const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
// const BASE_URL = "http://52.59.162.108:4000";

export async function saveScan({ scannedData, scannedAt, scanId }) {
  try {
    const res = await fetch(`${BASE_URL}/api/scans/saveScan/${scanId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        result: scannedData,
        scannedAt: scannedAt,
      }),
    });

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: impossibile aggiornare la lettura`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Errore nell'aggiornamento della lettura:", error.message);
    throw error;
  }
}

export async function getScans({ shipId, userId }) {
  try {
    const res = await fetch(`${BASE_URL}/api/scans/getScans?ship_id=${shipId}&user_id=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: impossibile recuperare le scans`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Errore nel recupero delle scans:", error.message);
    throw error;
  }
}

export async function createScan(element_id, ship_id, user_id) {
  try {
    const response = await fetch(`${BASE_URL}/api/scans/createScan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ element_id, ship_id, user_id }),
    });
    return await response.json();
  } catch (error) {
    console.error("Errore createScan:", error);
    return null;
  }
}