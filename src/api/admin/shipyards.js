const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

export async function getShipyards() {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/shipyards/getShipyards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Errore nel recupero cantieri");
    }

    return data;
  } catch (error) {
    console.error("Errore nel recupero cantieri:", error.message);
    throw error;
  }
}


export async function createShipModel(newModel) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/shipyards/createShipModel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newModel),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Errore durante la creazione del modello nave");
    }

    return data;
  } catch (error) {
    console.error("Errore creazione modello nave:", error.message);
    throw error;
  }
}

export async function getShipModels() {
  const res = await fetch(
    `${BASE_URL}/api/admin/shipyards/getAvailableShipModels`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Errore recupero modelli nave");
  }

  return data;
}

export async function createShipyards(newShipyards) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/shipyards/createShipyards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newShipyards),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Errore durante la creazione dei cantieri");
    }

    return data;
  } catch (error) {
    console.error("Errore creazione cantieri:", error.message);
    throw error;
  }
}

export async function updateShipyard(id, updatedData) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/shipyards/updateShipyard/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Errore durante l'aggiornamento del cantiere");
    }

    return data;
  } catch (error) {
    console.error("Errore aggiornamento cantiere:", error.message);
    throw error;
  }
}
