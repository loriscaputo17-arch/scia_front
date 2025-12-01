const API_URL = "http://localhost:4000"; 
//const API_URL = "http://52.59.162.108:4000";

export async function getSettings(userId) {
  try {
    if (!userId) {
      throw new Error("userId è richiesto per ottenere le impostazioni");
    }

    const response = await fetch(`${API_URL}/api/settings/getSettings/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero delle impostazioni");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore API getSettings:", error);
    return null;
  }
}

export async function updateSettings({
  user_id,
  isNotificationsEnabledMaintenance,
  maintenanceFrequency,
  isNotificationsEnabledChecklist,
  checklistFrequency,
  license,
}) {
  try {
    const response = await fetch(`${API_URL}/api/settings/updateSettings`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        is_notifications_enabled_maintenance: isNotificationsEnabledMaintenance,
        maintenance_frequency: maintenanceFrequency,
        is_notifications_enabled_checklist: isNotificationsEnabledChecklist,
        checklist_frequency: checklistFrequency,
        license,
      }),
    });

    if (!response.ok) {
      throw new Error("Errore nel salvataggio delle impostazioni");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore API updateSettings:", error);
    return null;
  }
}

