const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

/* 🔹 Tutte le organization */
export async function getOrganizations() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/organization/getOrganizations`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Errore nel recupero organizzazioni");
    }

    return data;
  } catch (error) {
    console.error("Errore nel recupero organizzazioni:", error.message);
    throw error;
  }
}

/* 🔹 Produttori */
export async function getProducers() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/organization/getProducers`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Errore nel recupero produttori");
    }

    return data;
  } catch (error) {
    console.error("Errore nel recupero produttori:", error.message);
    throw error;
  }
}

/* 🔹 Distributori */
export async function getSuppliers() {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/organization/getSuppliers`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Errore nel recupero distributori");
    }

    return data;
  } catch (error) {
    console.error("Errore nel recupero distributori:", error.message);
    throw error;
  }
}

/* 🔹 Update generico organization */
export async function updateOrganization(orgId, updateData) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/organization/updateOrganization/${orgId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Errore aggiornamento organizzazione");
    }

    return data;
  } catch (error) {
    console.error("Errore aggiornamento organizzazione:", error.message);
    throw error;
  }
}

/* 🔹 Update Supplier */
export async function updateSupplier(supplierId, updateData) {
  return updateOrganization(supplierId, updateData);
}

/* 🔹 Update Distributor */
export async function updateDistributor(distributorId, updateData) {
  return updateOrganization(distributorId, updateData);
}

/* 🔹 Create Producer */
export async function createProducer(payload) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/organization/createProducer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Errore creazione produttore");
    }

    return data;
  } catch (error) {
    console.error("Errore creazione produttore:", error.message);
    throw error;
  }
}
