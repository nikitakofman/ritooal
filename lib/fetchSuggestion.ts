import formatTodosForAI from "./formatTodosForAI";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board);

  const res = await fetch("api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTdata = await res.json();

  const { choices } = GPTdata;

  return choices[0].message.content;
};

export default fetchSuggestion;
