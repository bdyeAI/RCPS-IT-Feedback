// Paste this into Google Apps Script (Extensions -> Apps Script)
// Deploy as a Web App (Execute as: Me, Access: Anyone)

const SHEET_NAME = "Sheet1"; // change if your tab name differs

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const body = e.postData && e.postData.contents ? e.postData.contents : "{}";
    const data = JSON.parse(body);

    const score = Number(data.score);
    if (!score || score < 1 || score > 5) {
      return json_({ ok: false, error: "Invalid score" });
    }

    sheet.appendRow([
      new Date(),
      score,
      (data.comments || "").toString(),
      (data.customer || "").toString(),
      (data.ticket || "").toString(),
      (data.userAgent || "").toString()
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  const mode = (e.parameter.mode || "").toLowerCase();
  if (mode !== "counts") return json_({ ok: true, message: "Use ?mode=counts" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  const counts = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  let total = 0;

  for (let i = 1; i < values.length; i++) {
    const score = String(values[i][1]);
    if (counts[score] !== undefined) {
      counts[score]++;
      total++;
    }
  }

  return json_({ ok: true, counts, total });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
