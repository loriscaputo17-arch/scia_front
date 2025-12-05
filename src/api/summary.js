const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

export async function fetchDashboardSummary(shipId, userId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/summary?ship_id=${shipId}&user_id=${userId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - Impossibile recuperare la dashboard summary`);
    }

    const data = await res.json();
    return data; // { counters: {...}, last: {...} }
  } catch (error) {
    console.error("Errore getDashboardSummary:", error);
    return { counters: {}, last: {} };
  }
}
