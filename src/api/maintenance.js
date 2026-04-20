// lib/api/maintenance.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

function authHeaders(extra = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function fetchMaintenanceTypes(shipId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/maintenance/type?shipId=${shipId}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    const data = await res.json();
    return data.maintenanceTypes || [];
  } catch (error) {
    console.error("Errore tipi manutenzione:", error.message);
    return [];
  }
}

export async function fetchMaintenanceJobs(typeId, shipId, userId, page = 1, limit = 30, filters = null, eswbsCode = null) {
  try {
    const params = new URLSearchParams({ page, limit });
    if (shipId) params.append("shipId", shipId);
    if (typeId && typeId !== "undefined") params.append("type_id", typeId);

    if (eswbsCode) params.append("eswbs_code", eswbsCode);

    if (filters) {
      if (filters.stato) {
        const statiAttivi = Object.entries(filters.stato)
          .filter(([_, v]) => v).map(([k]) => k);
        if (statiAttivi.length) params.append("stato", statiAttivi.join(","));
      }
      if (filters.ricorrenza) {
        const ricorrenze = Object.entries(filters.ricorrenza)
          .filter(([_, v]) => v).map(([k]) => k);
        if (ricorrenze.length) params.append("ricorrenza", ricorrenze.join(","));
      }
      if (filters.livello) {
        const livelli = Object.entries(filters.livello)
          .filter(([_, v]) => v).map(([k]) => k);
        if (livelli.length) params.append("livello", livelli.join(","));
      }
      if (filters.ricambi?.richiesti) params.append("ricambi", "richiesti");

      if (filters.system?.selectedElement && !eswbsCode) {
        params.append("eswbs_code", filters.system.selectedElement);
      }

      if (filters?.ricorrenza_giorni?.from) {
        params.append("days_from", filters.ricorrenza_giorni.from);
      }
      if (filters?.ricorrenza_giorni?.to) {
        params.append("days_to", filters.ricorrenza_giorni.to);
      }
    }

    const res = await fetch(`${BASE_URL}/api/maintenance/jobs?${params}`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    const data = await res.json();
    return { jobs: data.jobs || [], hasMore: data.hasMore ?? false, total: data.total ?? 0 };
  } catch (error) {
    console.error("Errore jobs manutenzione:", error.message);
    return { jobs: [], hasMore: false, total: 0 };
  }
}

export async function fetchMaintenanceJobsOnCondition(eswbsCode, shipId, userId) {
  try {
    const params = new URLSearchParams();

    if (shipId) params.append("shipId", shipId);
    if (userId) params.append("user_id", userId);
    if (eswbsCode) params.append("eswbs_code", eswbsCode);

    const res = await fetch(
      `${BASE_URL}/api/maintenance/jobs-on-condition?${params}`,
      { headers: authHeaders() }
    );

    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

    const data = await res.json();

    return {
      jobs: data.jobs || [],
      total: data.total ?? 0,
    };

  } catch (error) {
    console.error("Errore jobs on condition:", error.message);
    return { jobs: [], total: 0 };
  }
}

export async function fetchMaintenanceFollowUp(jobId, shipId, userId) {
  try {
    const params = new URLSearchParams();

    if (jobId) params.append("job_id", jobId);
    if (shipId) params.append("shipId", shipId);
    if (userId) params.append("user_id", userId);

    const res = await fetch(
      `${BASE_URL}/api/maintenance/follow-up?${params}`,
      { headers: authHeaders() }
    );

    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);

    const data = await res.json();

    return {
      jobs: data.jobs || [],
      total: data.total ?? 0,
    };

  } catch (error) {
    console.error("Errore follow-up:", error.message);
    return { jobs: [], total: 0 };
  }
}

export async function fetchMaintenanceJob(taskId, shipId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/maintenance/job?taskId=${taskId}&shipId=${shipId}`,
      { headers: authHeaders() }
    );
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    const data = await res.json();
    return data.jobs || [];
  } catch (error) {
    console.error("Errore job manutenzione:", error.message);
    return [];
  }
}

export async function updateMaintenanceJobStatus(taskId, status_id, shipId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/maintenance/updateStatus/${taskId}?shipId=${shipId}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ status_id }),
      }
    );
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Errore update status:", error.message);
    return [];
  }
}

export async function handleSaveStatusComment(taskId, commentData, shipId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/maintenance/saveStatusComment/${taskId}?shipId=${shipId}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(commentData),
      }
    );
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Errore save comment:", error.message);
    return [];
  }
}

export async function markAs(taskId, mark, shipId) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/maintenance/reportAnomaly/${taskId}?shipId=${shipId}`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ mark }),
      }
    );
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Errore reportAnomaly:", error.message);
    return [];
  }
}

export async function markAsOk(maintenanceListId, spareData, imageFiles = [], shipId) {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = new FormData();

    Object.entries(spareData).forEach(([key, value]) => {
      if (Array.isArray(value) || typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    // ← solo File reali, non stringhe
    imageFiles.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });

    const res = await fetch(
      `${BASE_URL}/api/maintenance/markAsOk/${maintenanceListId}?shipId=${shipId}`,
      {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      }
    );

    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Errore markAsOk:", error.message);
    return null; // ← ritorna null invece di [] per distinguere errore da lista vuota
  }
}