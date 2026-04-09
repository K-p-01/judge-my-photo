import { useState, useRef, useCallback } from "react";

const JUDGES = [
  {
    id: "recruiter",
    emoji: "💼",
    title: "Tech Recruiter",
    subtitle: "JP Morgan · Google · Microsoft",
    description: "Scans LinkedIn in 3 seconds. Decides if you look professional, competent, and approachable.",
    color: "#4A9EFF",
    dimensions: ["Professionalism", "Approachability", "Confidence", "Background"],
  },
  {
    id: "hinge",
    emoji: "💘",
    title: "Dating App Swiper",
    subtitle: "Hinge · Bumble · Tinder",
    description: "Swipes in 1.5 seconds. Judges attractiveness, vibe, and whether you look interesting to talk to.",
    color: "#FF6B8A",
    dimensions: ["Attractiveness", "Vibe", "Smile", "Authenticity"],
  },
  {
    id: "instagram",
    emoji: "📱",
    title: "Instagram Audience",
    subtitle: "Feed · Stories · Reels thumbnail",
    description: "Scrolling at full speed. Stops only if the photo is visually striking or emotionally compelling.",
    color: "#FF9A3C",
    dimensions: ["Visual Impact", "Aesthetic", "Composition", "Shareability"],
  },
  {
    id: "college",
    emoji: "🎓",
    title: "College Admissions",
    subtitle: "IIT · Top B-Schools · MBA Programs",
    description: "Looks at your application photo for maturity, seriousness, and whether you seem like a future leader.",
    color: "#7C6AFF",
    dimensions: ["Maturity", "Seriousness", "Presentation", "Trustworthiness"],
  },
  {
    id: "brand",
    emoji: "🏷️",
    title: "Brand Collaborator",
    subtitle: "Sponsorships · Brand deals",
    description: "Assesses if your image fits their brand identity — clean, aspirational, and marketable.",
    color: "#2ECC8A",
    dimensions: ["Brand Fit", "Clean Image", "Aspiration", "Reach Potential"],
  },
  {
    id: "investor",
    emoji: "📊",
    title: "Startup Investor",
    subtitle: "Pitch deck · AngelList · LinkedIn",
    description: "Deciding if you look like a founder worth betting on. Credibility and energy matter most.",
    color: "#F4C430",
    dimensions: ["Credibility", "Energy", "Leadership", "Trust"],
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Syne:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080808;
    --surface: #111;
    --border: #1e1e1e;
    --text: #e8e0d0;
    --muted: #555;
    --faint: #1a1a1a;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .header {
    margin-bottom: 56px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 32px;
  }
  .header-eyebrow {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .header h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(42px, 8vw, 72px);
    font-weight: 900;
    line-height: 1;
    color: var(--text);
  }
  .header h1 em { font-style: italic; color: #fff; }
  .header-sub {
    margin-top: 14px;
    font-size: 13px;
    color: var(--muted);
    font-weight: 300;
    max-width: 400px;
    line-height: 1.6;
  }

  .step-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .step-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .upload-area {
    border: 1px dashed #2a2a2a;
    border-radius: 16px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--faint);
    margin-bottom: 48px;
  }
  .upload-area:hover, .upload-area.drag { border-color: #444; background: #161616; }
  .upload-area input { display: none; }
  .upload-icon { font-size: 32px; margin-bottom: 10px; opacity: 0.5; }
  .upload-hint { font-size: 13px; color: var(--muted); line-height: 1.7; }
  .upload-hint b { color: var(--text); font-weight: 500; }

  .photo-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }
  .photo-chip {
    position: relative;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .photo-chip img { width: 100%; height: 100%; object-fit: cover; }
  .photo-chip-num {
    position: absolute;
    bottom: 4px; left: 4px;
    background: rgba(0,0,0,0.75);
    font-size: 9px;
    color: #aaa;
    padding: 2px 5px;
    border-radius: 4px;
    letter-spacing: 1px;
  }
  .photo-chip-del {
    position: absolute;
    top: 4px; right: 4px;
    width: 18px; height: 18px;
    background: rgba(0,0,0,0.8);
    border: none;
    color: #aaa;
    border-radius: 50%;
    cursor: pointer;
    font-size: 9px;
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .photo-chip:hover .photo-chip-del { opacity: 1; }

  .judge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    margin-bottom: 48px;
  }
  .judge-card {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--faint);
    position: relative;
    overflow: hidden;
  }
  .judge-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .judge-card:hover { border-color: #333; background: #141414; }
  .judge-card.selected { border-color: var(--accent) !important; background: #141414; }
  .judge-card.selected::before { opacity: 1; }
  .judge-emoji { font-size: 24px; margin-bottom: 10px; }
  .judge-title { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .judge-subtitle { font-size: 10px; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; }
  .judge-desc { font-size: 12px; color: #666; line-height: 1.5; font-weight: 300; }
  .judge-dims { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 10px; }
  .judge-dim {
    font-size: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    color: #555;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .judge-card.selected .judge-dim { border-color: rgba(255,255,255,0.1); color: #777; }

  .analyze-btn {
    width: 100%;
    padding: 18px;
    border: none;
    border-radius: 12px;
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-style: italic;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--text);
    color: #080808;
    letter-spacing: 0.5px;
  }
  .analyze-btn:hover:not(:disabled) { background: #fff; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(255,255,255,0.1); }
  .analyze-btn:disabled { opacity: 0.25; cursor: not-allowed; transform: none; box-shadow: none; }

  .loading-state { text-align: center; padding: 60px 0; }
  .loading-orb {
    width: 48px; height: 48px;
    border-radius: 50%;
    border: 1px solid var(--border);
    border-top-color: var(--text);
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-judge-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-style: italic;
    color: var(--text);
    margin-bottom: 6px;
  }
  .loading-sub { font-size: 12px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }

  .results-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .results-title { font-family: 'Playfair Display', serif; font-size: 28px; font-style: italic; color: var(--text); }
  .results-judge-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--faint);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    color: var(--muted);
  }

  .verdict-box {
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 32px;
    border: 1px solid var(--border);
    background: var(--faint);
    font-size: 14px;
    color: #999;
    line-height: 1.7;
    font-weight: 300;
  }
  .verdict-box strong { color: var(--text); font-weight: 500; }

  .result-row {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 24px;
    margin-bottom: 24px;
    padding: 24px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--faint);
    animation: slideIn 0.4s ease forwards;
    opacity: 0;
    transition: border-color 0.2s;
  }
  .result-row:hover { border-color: #2a2a2a; }
  .result-row.top { border-color: var(--judge-color); }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .result-row:nth-child(1) { animation-delay: 0.05s; }
  .result-row:nth-child(2) { animation-delay: 0.12s; }
  .result-row:nth-child(3) { animation-delay: 0.19s; }
  .result-row:nth-child(4) { animation-delay: 0.26s; }
  .result-row:nth-child(5) { animation-delay: 0.33s; }

  .result-img {
    width: 110px; height: 130px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    flex-shrink: 0;
  }
  .result-img img { width: 100%; height: 100%; object-fit: cover; }

  .result-body { flex: 1; }
  .result-rank-line { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .rank-badge {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 20px;
    font-weight: 600;
  }
  .rank-badge.first { background: rgba(255,255,255,0.08); color: var(--text); }
  .rank-badge.other { background: var(--faint); color: var(--muted); border: 1px solid var(--border); }
  .photo-ref { font-size: 11px; color: var(--muted); }

  .result-headline {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-style: italic;
    color: var(--text);
    margin-bottom: 10px;
    line-height: 1.3;
  }

  .dim-scores { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .dim-row { display: flex; align-items: center; gap: 10px; }
  .dim-name { font-size: 10px; color: var(--muted); width: 110px; flex-shrink: 0; letter-spacing: 1px; text-transform: uppercase; }
  .dim-bar { flex: 1; height: 3px; background: #1e1e1e; border-radius: 2px; overflow: hidden; }
  .dim-fill { height: 100%; border-radius: 2px; transition: width 1s ease; }
  .dim-val { font-size: 10px; color: var(--muted); width: 28px; text-align: right; flex-shrink: 0; }

  .result-verdict { font-size: 12px; color: #666; line-height: 1.6; font-weight: 300; margin-bottom: 12px; }

  .tip-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid #222;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12px;
    color: #888;
    line-height: 1.5;
  }
  .tip-box span { color: var(--text); font-weight: 500; }

  .overall-score {
    font-size: 24px;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    color: var(--text);
    margin-left: auto;
  }
  .overall-score sub { font-size: 12px; color: var(--muted); font-family: 'Syne', sans-serif; font-style: normal; }

  .reset-btn {
    margin-top: 40px;
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 12px 24px;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .reset-btn:hover { border-color: #444; color: var(--text); }

  .error-strip {
    background: #1a0808;
    border: 1px solid #3a1010;
    border-radius: 10px;
    padding: 14px 18px;
    color: #ff7070;
    font-size: 13px;
    margin-top: 16px;
  }
`;

export default function JudgeMyPhoto() {
  const [photos, setPhotos] = useState([]);
  const [judge, setJudge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  const addPhotos = useCallback((files) => {
    Array.from(files).filter(f => f.type.startsWith("image/")).forEach(file => {
      const r = new FileReader();
      r.onload = e => setPhotos(p => [...p, {
        id: Date.now() + Math.random(),
        name: file.name,
        url: e.target.result,
        b64: e.target.result.split(",")[1],
        mime: file.type,
      }]);
      r.readAsDataURL(file);
    });
  }, []);

  const analyze = async () => {
    if (!photos.length || !judge) return;
    setLoading(true); setResults(null); setError(null);

    const j = JUDGES.find(x => x.id === judge);

    try {
      const imageBlocks = photos.map(p => ({
        type: "image",
        source: { type: "base64", media_type: p.mime, data: p.b64 }
      }));

      const prompt = `You are simulating the judgment of: "${j.title}" (${j.subtitle}).

Their mindset: ${j.description}
They evaluate on these dimensions: ${j.dimensions.join(", ")}.

I am sending ${photos.length} photo(s). Evaluate ALL of them from this judge's exact perspective.

Respond ONLY with raw JSON (no markdown, no backticks):
{
  "judgeVerdict": "2-3 sentences as the judge describing their overall impression of the batch",
  "photos": [
    {
      "index": 0,
      "rank": 1,
      "headline": "One punchy sentence the judge would say about this photo",
      "overallScore": 82,
      "dimensions": [
        { "name": "Professionalism", "score": 85 },
        ...
      ],
      "verdict": "2 sentences of specific judgment from this persona's POV",
      "tip": "One concrete, actionable improvement this judge would recommend"
    }
  ]
}

Rules:
- index is 0-based
- rank 1 = best for this judge's criteria
- overallScore 0-100
- dimension scores 0-100
- Be ruthlessly specific, not generic
- Sort photos array by rank ascending`;

      const res = await fetch("https://judge-backend-9kt5.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: [...imageBlocks, { type: "text", text: prompt }] }]
        })
      });

      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResults({ ...parsed, judge: j });
    } catch (e) {
      setError("Analysis failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResults(null); setPhotos([]); setJudge(null); setError(null); };

  const selectedJudge = JUDGES.find(x => x.id === judge);

  return (
    <>
      <style>{css}</style>
      <style>{`.judge-card { --accent: ${selectedJudge?.color || "#fff"} }`}</style>

      <div className="wrap">
        <div className="header">
          <div className="header-eyebrow">AI Photo Intelligence</div>
          <h1>Judge My<br /><em>Photo</em></h1>
          <p className="header-sub">See your photo through the eyes of whoever matters — recruiter, swiper, brand, investor.</p>
        </div>

        {!results && !loading && (
          <>
            <div className="step-label">Step 01 — Upload photos</div>
            <div
              className={`upload-area ${drag ? "drag" : ""}`}
              onClick={() => fileRef.current.click()}
              onDrop={e => { e.preventDefault(); setDrag(false); addPhotos(e.dataTransfer.files); }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
            >
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={e => addPhotos(e.target.files)} />
              <div className="upload-icon">⬆</div>
              <div className="upload-hint">
                <b>Click to upload</b> or drag photos here<br />
                Multiple files supported · JPG, PNG, WEBP
              </div>
              {photos.length > 0 && (
                <div className="photo-strip" onClick={e => e.stopPropagation()}>
                  {photos.map((p, i) => (
                    <div key={p.id} className="photo-chip">
                      <img src={p.url} alt="" />
                      <span className="photo-chip-num">#{i + 1}</span>
                      <button className="photo-chip-del" onClick={() => setPhotos(prev => prev.filter(x => x.id !== p.id))}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="step-label">Step 02 — Choose your judge</div>
            <div className="judge-grid">
              {JUDGES.map(j => (
                <div
                  key={j.id}
                  className={`judge-card ${judge === j.id ? "selected" : ""}`}
                  style={{ "--accent": j.color }}
                  onClick={() => setJudge(j.id)}
                >
                  <div className="judge-emoji">{j.emoji}</div>
                  <div className="judge-title">{j.title}</div>
                  <div className="judge-subtitle">{j.subtitle}</div>
                  <div className="judge-desc">{j.description}</div>
                  <div className="judge-dims">
                    {j.dimensions.map(d => <span key={d} className="judge-dim">{d}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="analyze-btn"
              disabled={!photos.length || !judge}
              onClick={analyze}
            >
              {photos.length === 0 ? "Upload photos first" : !judge ? "Select a judge" : `Judge ${photos.length} Photo${photos.length > 1 ? "s" : ""}`}
            </button>
            {error && <div className="error-strip">⚠ {error}</div>}
          </>
        )}

        {loading && (
          <div className="loading-state">
            <div className="loading-orb" />
            <div className="loading-judge-name">{selectedJudge?.emoji} {selectedJudge?.title}</div>
            <div className="loading-sub">Judging your photos...</div>
          </div>
        )}

        {results && (
          <>
            <div className="results-header">
              <div className="results-title">The Verdict</div>
              <div className="results-judge-badge">
                <span>{results.judge.emoji}</span>
                <span>{results.judge.title}</span>
              </div>
            </div>

            <div className="verdict-box">
              <strong>Overall: </strong>{results.judgeVerdict}
            </div>

            {results.photos?.map((p, i) => {
              const photo = photos[p.index];
              if (!photo) return null;
              return (
                <div
                  key={i}
                  className={`result-row ${p.rank === 1 ? "top" : ""}`}
                  style={{ "--judge-color": results.judge.color }}
                >
                  <div className="result-img"><img src={photo.url} alt="" /></div>
                  <div className="result-body">
                    <div className="result-rank-line">
                      <span className={`rank-badge ${p.rank === 1 ? "first" : "other"}`}
                        style={p.rank === 1 ? { background: results.judge.color + "20", color: results.judge.color } : {}}>
                        {p.rank === 1 ? "Top Pick" : `#${p.rank}`}
                      </span>
                      <span className="photo-ref">Photo {p.index + 1}</span>
                      <span className="overall-score">{p.overallScore}<sub>/100</sub></span>
                    </div>
                    <div className="result-headline">"{p.headline}"</div>
                    <div className="dim-scores">
                      {p.dimensions?.map(d => (
                        <div key={d.name} className="dim-row">
                          <span className="dim-name">{d.name}</span>
                          <div className="dim-bar">
                            <div className="dim-fill" style={{ width: `${d.score}%`, background: results.judge.color }} />
                          </div>
                          <span className="dim-val">{d.score}</span>
                        </div>
                      ))}
                    </div>
                    <div className="result-verdict">{p.verdict}</div>
                    <div className="tip-box">
                      <span>→ Fix: </span>{p.tip}
                    </div>
                  </div>
                </div>
              );
            })}

            <button className="reset-btn" onClick={reset}>Start Over</button>
          </>
        )}
      </div>
    </>
  );
}
