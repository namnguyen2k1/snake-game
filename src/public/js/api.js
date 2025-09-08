export async function callApiSaveMatchResult({ name, date, time, score }) {
  try {
    const url = "/api/match";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, date, time, score }),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log("data", data);

    return data;
  } catch (error) {
    console.log(error);
    throw err;
  }
}

export async function callApiGetMatchHistory(option) {
  try {
    const url = "/api/match/all";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(option),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log("data", data);

    return data;
  } catch (error) {
    console.log(error);
    throw err;
  }
}
