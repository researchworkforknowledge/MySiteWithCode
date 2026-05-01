export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { prompt, persona, board, cls, sub } = req.body;

  // Same AI personalities you use in the frontend
  const systemMessages = {
    notes: "You are the Master Scribe — create structured study notes for Indian board exams.",
    pyq: "You are a senior Board Examiner creating authentic exam papers.",
    pred: "You are an Exam Oracle predicting most likely board exam topics.",
    doubts: "You are a brilliant teacher using the Feynman Technique. For every question, provide: Simple Explanation, Academic Answer, Real-World Analogy, Common Mistake, Memory Trick.",
    weak: "You are a Study Recovery Coach. Create a 3-day recovery plan for weak topics.",
    mm: 'Return ONLY valid JSON for a mind map: {"center":"Topic","branches":[{"label":"...","color":"#hex","children":["..."]}]}.',
    quiz: 'Return ONLY a JSON array: [{"q":"Question?","opts":["A","B","C","D"],"ans":0,"exp":"Why correct"}]. Generate exactly 5 questions.',
    strat: "You are a Study Strategy Architect. Provide a weekly timetable, topic priority matrix, exam tips.",
    motiv: "You are an inspiring personal coach. Give a warm, genuine motivational message (150-200 words)."
  };

  const sys = (systemMessages[persona] || systemMessages.doubts) +
    `\n[Board: ${board || 'CBSE'}, Class: ${cls || '10'}, Subject: ${sub || 'Mathematics'}]`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.6,
        max_tokens: 2048,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Groq error ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
