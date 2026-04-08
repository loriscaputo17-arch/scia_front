const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
//const BASE_URL = "http://52.59.162.108:4000";

export async function fetchTasks(shipId, userId, page = 1, limit = 30, filters = null, typeId = null) {
  try {
    const params = new URLSearchParams({ ship_id: shipId, userId, page, limit });
    if (typeId) params.append("type_id", typeId);

    if (filters) {
      if (filters.task?.nascondiTaskEseguiti) params.append("nascondiEseguiti", "1");

      const macroAttivi = Object.entries(filters.macrogruppoESWBS || {})
        .filter(([, v]) => v)
        .map(([k]) => k[0]); // primo digit: "1", "2", ...
      if (macroAttivi.length) params.append("macrogroups", macroAttivi.join(","));

      const squadreAttive = Object.entries(filters.squadraDiAssegnazione || {})
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (squadreAttive.length) params.append("squadre", squadreAttive.join(","));
    }

    const res = await fetch(`${BASE_URL}/api/checklist/getTasks?${params}`);
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
    const data = await res.json();
    return {
      tasks: data.tasks || [],
      hasMore: data.hasMore ?? false,
      total: data.total ?? 0,
    };
  } catch (error) {
    console.error("Errore nel recupero dei task:", error.message);
    return { tasks: [], hasMore: false, total: 0 };
  }
}
