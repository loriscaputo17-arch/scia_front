const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

export async function fetchElements(shipId, userId, teamId) {
  try {
    const res = await fetch(`${BASE_URL}/api/element/getElements/${shipId}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId,
      }),
    });

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: Impossibile recuperare gli elementi`);
    }

    return await res.json();
  } catch (error) {
    console.error("Errore nel recupero elementi:", error);
    return [];
  }
}


export async function fetchElementData(element, ship_id) {
  try {
    const res = await fetch(`${BASE_URL}/api/element/getElement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ element, ship_id }),
    });

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: Impossibile recuperare i dati`);
    }

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error("Errore nel recupero dell'elemento:", error.message);
    return [];
  }
}   