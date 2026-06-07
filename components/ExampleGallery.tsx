import { STYLES } from "@/lib/styles";

const EXAMPLES = [
  { label: "Scandinavian", beforeGradient: "#D0C5B8", style: STYLES[0] },
  { label: "Japandi", beforeGradient: "#C2B8AC", style: STYLES[1] },
  { label: "Mid-Century", beforeGradient: "#C8B89A", style: STYLES[3] },
];

export default function ExampleGallery() {
  return (
    <div className="space-y-5 pt-4">
      <p className="font-body text-xs tracking-widest uppercase text-muted">
        Example transformations
      </p>
      <div className="grid grid-cols-3 gap-3">
        {EXAMPLES.map((ex) => (
          <div key={ex.label} className="space-y-1.5">
            <div className="rounded-lg overflow-hidden flex h-28">
              {/* Before */}
              <div
                className="flex-1 flex items-end p-1.5"
                style={{ background: ex.beforeGradient }}
              >
                <span className="font-body text-[9px] tracking-widest uppercase text-text/50">
                  Before
                </span>
              </div>
              {/* After */}
              <div
                className="flex-1 flex items-end p-1.5"
                style={{ background: ex.style.gradient }}
              >
                <span className="font-body text-[9px] tracking-widest uppercase text-bg/60">
                  After
                </span>
              </div>
            </div>
            <p className="font-body text-xs text-muted">{ex.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
