# CSAT Survey (GitHub Pages + Google Sheets)

This repo is a lightweight customer satisfaction (CSAT) survey you can host on **GitHub Pages**.
- Q1: 5 clickable smiley faces (cropped from one image)
- Q2: optional comments
- Responses are stored in **Google Sheets** via a small **Google Apps Script** endpoint.
- A simple dashboard displays results as charts.

## 1) Files
- `index.html` – survey
- `thanks.html` – success page
- `dashboard.html` – charts
- `app.js` – submits responses
- `dashboard.js` – loads counts for charts
- `styles.css` – styling
- `images/smiley-question.png` – face icon strip
- `apps-script.gs` – backend script (copy into Apps Script)

## 2) Set up storage (Google Sheet)
1. In Google Drive, create a new Google Sheet named anything you like (e.g., **CSAT Responses**).
2. In row 1, add headers:
   - `timestamp | score | comments | customer | ticket | userAgent`
3. Extensions → **Apps Script**
4. Paste the contents of `apps-script.gs`.
5. Make sure `SHEET_NAME` matches your sheet tab name (often `Sheet1`).
6. Deploy → **New deployment** → Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the Web App URL.

## 3) Connect the frontend to the backend
Open these files and replace `YOUR_SCRIPT_URL` with your Apps Script Web App URL:
- `app.js`
- `dashboard.js`

## 4) Host on GitHub Pages
1. Push this repo to GitHub.
2. Repo Settings → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` / folder: `/ (root)`
5. Your pages will be:
   - Survey: `https://YOURNAME.github.io/REPO/`
   - Dashboard: `https://YOURNAME.github.io/REPO/dashboard.html`

## 5) Email customers (Gmail)
### What you can do in normal Gmail
Gmail does **not** support reliable interactive web forms inside the email body (most form elements/scripts are blocked).
The normal, reliable method is:
- Put a **link button** in the email that opens the survey page.

Example link (with optional tracking):
```
https://YOURNAME.github.io/REPO/?customer=Acme&ticket=123
```

### If you truly need “complete inside the email”
The only real way is **AMP for Email**, which requires:
- Sending from an authenticated domain (SPF/DKIM/DMARC)
- Registering/being approved for AMP email
- Writing an AMP version of the email and a backend endpoint

Most teams skip AMP and use the “tap to open survey” flow.

## 6) How data is stored
When the customer submits:
- The survey sends JSON to your Apps Script Web App.
- Apps Script appends a new row to your Google Sheet:
  - Timestamp, Score (1–5), Comments, Customer (optional), Ticket (optional), UserAgent.

## 7) How data is displayed
The dashboard (`dashboard.html`) calls:
- `YOUR_SCRIPT_URL?mode=counts`

Apps Script reads the sheet and returns counts per score.
Then Chart.js renders:
- Bar chart
- Doughnut chart

---

### Security note
This is intentionally lightweight. If you want to prevent spam or multiple submissions per customer, add:
- a unique token per email
- simple rate limiting
- or reCAPTCHA / hCaptcha (requires a server-side verify step)
