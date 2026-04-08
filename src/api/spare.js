const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
//const BASE_URL = "http://52.59.162.108:4000";

export async function fetchSpare(id, name) {
  try {
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (id) params.append("id", id);

    const res = await fetch(`${BASE_URL}/api/spare/getSpare?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: Impossibile recuperare i ricambi`);
    }

    const data = await res.json();
    return data.spares || [];
  } catch (error) {
    console.error("Errore nel recupero dei ricambi:", error.message);
    return [];
  }
}

export async function fetchSpares(ship_id, page = 1, limit = 10, filters = null, search = "", selectedCode = null) {
  try {
    const params = new URLSearchParams({ ship_id, page, limit });
    if (search) params.append("search", search);
    if (selectedCode) params.append("eswbs_code", selectedCode);
    if (filters?.task?.inGiacenza) params.append("inGiacenza", "1");
    if (filters?.task?.nonDisponibile) params.append("nonDisponibile", "1");

    const magazzinoAttivi = Object.entries(filters?.magazzino || {})
      .filter(([, v]) => v).map(([k]) => k);
    if (magazzinoAttivi.length) params.append("magazzino", magazzinoAttivi.join(","));

    const res = await fetch(`${BASE_URL}/api/spare/getSpares?${params}`);
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    const data = await res.json();
    return { spares: data.spares || [], hasMore: data.hasMore ?? false, total: data.total ?? 0 };
  } catch (error) {
    console.error("Errore nel recupero dei ricambi:", error.message);
    return { spares: [], hasMore: false, total: 0 };
  }
}

export async function fetchSpareById(ean13, partNumber, eswbsSearch) {
    try {
      const params = new URLSearchParams();
      if (ean13) params.append("ean13", ean13);
      if (partNumber) params.append("partNumber", partNumber);
      if (eswbsSearch) params.append("eswbsSearch", eswbsSearch);
  
      const res = await fetch(`${BASE_URL}/api/spare/fetchSpareById?${params.toString()}`);
  
      if (!res.ok) {
        throw new Error(`Errore HTTP ${res.status}: Impossibile recuperare i ricambi`);
      }
  
      const data = await res.json();
      return data.spares || [];
    } catch (error) {
      console.error("Errore nel recupero dei ricambi:", error.message);
      return [];
    }
}

export async function updateSpare(id, updateData, shipId, userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/spare/moveSpare/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {updateData, 
          ship_id: shipId,
          user_id: userId
        })
    });

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}: Impossibile aggiornare il ricambio`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Errore durante l'aggiornamento del ricambio:", error.message);
    return null;
  }
}

export async function submitProduct(data) {
  try {
    const res = await fetch(`${BASE_URL}/api/spare/submitProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Errore HTTP ${res.status}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Errore invio:", error.message);
    throw error;
  }
}

export async function uploadProductImage(formData) {
  try {
    const response = await fetch(`${BASE_URL}/api/spare/uploadProductImage`, {
      method: "POST",
      credentials: "include",
      body: formData, 
    });

    if (!response.ok) {
      throw new Error("Errore nel caricamento dell'immagine del prodotto");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore API uploadProductImage:", error);
    return null;
  }
};

export async function addSpareToMaintenanceList(maintenanceListId, spareData, file) {
  try {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    for (const key in spareData) {
      if (spareData.hasOwnProperty(key) && spareData[key] !== undefined && spareData[key] !== null) {
        formData.append(key, spareData[key]);
      }
    }

    const response = await fetch(`${BASE_URL}/api/spare/${maintenanceListId}/spares`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: Impossibile aggiungere il ricambio`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Errore durante l'aggiunta del ricambio alla Maintenance List:", error);
    return null;
  }
}
