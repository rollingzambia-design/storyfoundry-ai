"use client";

import { useMemo, useState } from "react";

const genres = ["True crime", "Dark real-life", "Psychology"] as const;
const lengths = ["Short (1–2 min)", "Medium (5–8 min)", "Long (10–15 min)"] as const;
const tones = ["Suspenseful", "Serious", "Reflective"] as const;
const tabs = ["Titles", "Hook", "Full script", "Image prompts", "Thumbnail ideas"] as const;

type FormState = {
  topic: string;
  genre: (typeof genres)[number];
  length: (typeof lengths)[number];
  tone: (typeof tones)[number];
};

type GeneratedPack = {
  titles: string[];
  hook: string;
  fullScript: string;
  imagePrompts: string[];
  thumbnailIdeas: string[];
};

const disclaimer = "This is a dramatized retelling for educational purposes.";

const sentenceCase = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

const buildTitles = (topic: string, genre: string, tone: string) => {
  const base = topic || "Untold case";
  const options = [
    `${base} and the quiet detail`,
    `The last hour of ${base}`,
    `A trail around ${base}`,
    `Why ${base} still matters`,
    `The night ${base} changed`,
    `Pieces of ${base}`,
    `A close look at ${base}`,
    `The hidden steps in ${base}`,
    `A simple clue in ${base}`,
    `What ${base} left behind`,
    `The long shadow of ${base}`,
    `The moment ${base} shifted`,
    `Inside the ${genre} around ${base}`,
    `The quiet truth of ${base}`,
    `A calm telling of ${base}`,
    `The choice that shaped ${base}`,
    `An unseen angle on ${base}`,
    `The narrow path of ${base}`,
    `The question at ${base}`,
    `The ${tone.toLowerCase()} side of ${base}`
  ];

  return options.map((title) => sentenceCase(title));
};

const buildHook = (topic: string, tone: string) =>
  `${sentenceCase(
    `a single note set the mood. ${topic || "This story"} begins with a small clue`
  )}, a quiet moment that turns into a slow, ${tone.toLowerCase()} unraveling. We move step by step, staying close to the facts and the feelings, until the first twist lands.`;

const buildFullScript = (form: FormState) => {
  const opener = sentenceCase(
    `${form.topic || "Our story"} starts in a place that looks normal from the outside`
  );

  return [
    `${opener}. The air is still, and the smallest sounds feel loud. We focus on one detail, then another, like a camera moving closer to the truth.`,
    `This ${form.genre.toLowerCase()} story is told in a ${form.tone.toLowerCase()} tone. It avoids graphic violence and stays on the human choices, the missed signals, and the long echoes.`,
    `We follow a clear timeline. Each step reveals a new layer. The people involved are shown with care. Their actions are described without judgment, but the consequences are clear.`,
    `As the minutes pass, the tension grows. A new fact surfaces, then a second one. The pieces start to align, and a pattern emerges that feels inevitable and unsettling.`,
    `The ending is calm, not loud. It leaves room for reflection and asks the viewer to consider what could have been different.`,
    disclaimer
  ].join("\n\n");
};

const buildImagePrompts = (topic: string, tone: string) => {
  const base = topic || "the case";
  const prompts = [
    `Wide shot of a quiet neighborhood at dusk, ${tone.toLowerCase()} lighting, cinematic shadows, no people visible.`,
    `Close-up of a handwritten note on a kitchen table, soft lamp light, moody atmosphere.`,
    `Empty hallway with a single door slightly open, long shadows, muted colors.`,
    `Nighttime exterior of a small town street, wet pavement reflections, calm tension.`,
    `Detail shot of a calendar with a date circled, shallow depth of field.`,
    `Silhouette of a person looking through a window, foggy glass, subtle mystery.`,
    `Desk with scattered files labeled "${base}", cinematic top-down shot.`,
    `Slow-moving fog over a quiet field, distant house lights, subdued palette.`,
    `Close-up of a ticking clock, dramatic lighting, shallow focus.`,
    `A dimly lit interview room, empty chair, soft overhead light.`,
    `Long corridor in a public building, cool tones, gentle film grain.`,
    `Sunrise over a quiet town, hopeful but restrained tone.`
  ];

  return prompts.slice(0, 12);
};

const buildThumbnailIdeas = (topic: string) => {
  const base = topic || "the case";
  return [
    `The quiet clue`,
    `What ${base} hid`,
    `A calm mystery`,
    `The missing detail`,
    `A story in shadows`
  ].map(sentenceCase);
};

const buildPack = (form: FormState): GeneratedPack => {
  return {
    titles: buildTitles(form.topic, form.genre, form.tone),
    hook: buildHook(form.topic, form.tone),
    fullScript: buildFullScript(form),
    imagePrompts: buildImagePrompts(form.topic, form.tone),
    thumbnailIdeas: buildThumbnailIdeas(form.topic)
  };
};

const formatTitles = (titles: string[]) => titles.map((title, index) => `${index + 1}. ${title}`).join("\n");
const formatPrompts = (prompts: string[]) => prompts.map((prompt, index) => `${index + 1}. ${prompt}`).join("\n");
const formatThumbnails = (ideas: string[]) => ideas.map((idea, index) => `${index + 1}. ${idea}`).join("\n");

const buildDownloadText = (pack: GeneratedPack) => {
  return [
    "StoryFoundry content pack",
    "",
    "Titles",
    formatTitles(pack.titles),
    "",
    "Hook",
    pack.hook,
    "",
    "Full script",
    pack.fullScript,
    "",
    "Scene-by-scene image prompts",
    formatPrompts(pack.imagePrompts),
    "",
    "Thumbnail text ideas",
    formatThumbnails(pack.thumbnailIdeas)
  ].join("\n");
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-slate-500 hover:text-white"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>({
    topic: "The quiet disappearance in Pine Hollow",
    genre: genres[0],
    length: lengths[1],
    tone: tones[0]
  });
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Titles");
  const [pack, setPack] = useState<GeneratedPack>(() => buildPack(form));

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerate = () => {
    setPack(buildPack(form));
  };

  const downloadText = useMemo(() => buildDownloadText(pack), [pack]);

  const handleDownload = () => {
    const blob = new Blob([downloadText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "storyfoundry-pack.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">StoryFoundry</p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Viral content packs for faceless YouTube</h1>
          <p className="max-w-2xl text-base text-slate-300">
            Generate structured, cinematic story packs for true crime, dark real-life, and psychological stories. No external APIs yet,
            just fast placeholder drafts that follow the StoryFoundry writing rules.
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleGenerate();
            }}
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="topic">
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={form.topic}
                onChange={(event) => handleChange("topic", event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
                placeholder="Describe the story focus"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="genre">
                Genre
              </label>
              <select
                id="genre"
                value={form.genre}
                onChange={(event) => handleChange("genre", event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="text-slate-900">
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="length">
                Length
              </label>
              <select
                id="length"
                value={form.length}
                onChange={(event) => handleChange("length", event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
              >
                {lengths.map((length) => (
                  <option key={length} value={length} className="text-slate-900">
                    {length}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="tone">
                Tone
              </label>
              <select
                id="tone"
                value={form.tone}
                onChange={(event) => handleChange("tone", event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400"
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone} className="text-slate-900">
                    {tone}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Generate content pack
            </button>
          </form>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    activeTab === tab
                      ? "bg-white text-slate-900"
                      : "border border-slate-700 text-slate-200 hover:border-slate-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              {activeTab === "Titles" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Titles</h2>
                    <CopyButton text={formatTitles(pack.titles)} />
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{formatTitles(pack.titles)}</pre>
                </div>
              )}

              {activeTab === "Hook" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Hook</h2>
                    <CopyButton text={pack.hook} />
                  </div>
                  <p className="text-sm text-slate-200">{pack.hook}</p>
                </div>
              )}

              {activeTab === "Full script" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Full script</h2>
                    <div className="flex gap-2">
                      <CopyButton text={pack.fullScript} />
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="rounded-full border border-indigo-400 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-200 transition hover:border-indigo-200 hover:text-white"
                      >
                        Download .txt
                      </button>
                    </div>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{pack.fullScript}</pre>
                </div>
              )}

              {activeTab === "Image prompts" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Scene-by-scene image prompts</h2>
                    <CopyButton text={formatPrompts(pack.imagePrompts)} />
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{formatPrompts(pack.imagePrompts)}</pre>
                </div>
              )}

              {activeTab === "Thumbnail ideas" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Thumbnail text ideas</h2>
                    <CopyButton text={formatThumbnails(pack.thumbnailIdeas)} />
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{formatThumbnails(pack.thumbnailIdeas)}</pre>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
