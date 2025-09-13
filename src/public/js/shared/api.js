async function callApi(url, body) {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log("data", data);

    return data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

export async function callApiSaveMatchResult({ name, date, time, score }) {
  return await callApi("/api/match", { name, date, time, score });
}

export async function callApiGetMatchHistory(option) {
  return await callApi("/api/match/all", option);
}
