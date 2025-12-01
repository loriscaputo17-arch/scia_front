const BASE_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

export async function uploadNote(failureId, authorId, type, content) {
  let endpoint = "";

  if (type === "photo") endpoint = "/api/uploadFiles/uploadPhotoGeneral";
  if (type === "vocal") endpoint = "/api/uploadFiles/uploadAudioGeneral";
  if (type === "text") endpoint = "/api/uploadFiles/uploadTextGeneral";

  const formData = new FormData();
  formData.append("failureId", failureId);
  formData.append("authorId", authorId);
  formData.append("type", type);

  if (type === "text") {
    formData.append("content", content); // <-- FIX 🚀
  } else {
    formData.append("file", content);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Errore caricamento nota");

  return await res.json();
}
