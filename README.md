# Scia Project

Questo è un progetto [Next.js](https://nextjs.org) avviato con [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## 🚀 Come iniziare

1️⃣ **Installa le dipendenze**

```bash
npm install

Install dependencies with:
npm install --legacy-peer-deps

````

2️⃣ **Avvia il server di sviluppo**

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) per vedere l'applicazione in esecuzione.

---

## 🗂️ Struttura del progetto

* **`/app`**
  Contiene tutte le pagine e sottopagine dell’applicazione.

* **`/components`**
  Contiene tutti i componenti React, organizzati per pagina.

* **`/src/api`**
  Contiene tutti i file per le chiamate API verso il backend.

* **`/public/locales`**
  Contiene le cartelle `en`, `es` e `it` per la gestione delle traduzioni (internazionalizzazione).

---

## 🌍 Deploy su Vercel

Il progetto è collegato a **Vercel** per il deploy automatico.

Per eseguire un deploy:

* Deploy di anteprima:

  ```bash
  vercel
  ```

* Deploy in produzione:

  ```bash
  vercel --prod
  ```

---

## 📦 Versionamento del codice

Il progetto usa **Bitbucket** come repository Git.

Comandi base:

```bash
git add .
git commit -m "Il tuo messaggio di commit"
git push
```

---

## 📚 Risorse utili

* 📘 [Documentazione Next.js](https://nextjs.org/docs)
* 📗 [Impara Next.js](https://nextjs.org/learn)
* 🗂️ [Repository Next.js su GitHub](https://github.com/vercel/next.js)

---

## ✅ Note

* L’app usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) per ottimizzare automaticamente i font ([Geist](https://vercel.com/font) di Vercel).
* Puoi modificare la pagina iniziale in `app/page.js`.
  Le modifiche vengono applicate automaticamente grazie al refresh live.
