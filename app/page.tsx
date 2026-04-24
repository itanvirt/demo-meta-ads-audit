import { AlertTriangle, TrendingUp, TrendingDown, Users, Eye, DollarSign, Zap, ExternalLink, CheckCircle, XCircle, AlertCircle } from "lucide-react";

type Severity = "critical" | "warning" | "ok";

type Campaign = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  spend: number;
  revenue: number;
  roas: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
  audienceOverlap: number;
  issues: { severity: Severity; type: string; message: string; fix: string }[];
};

const campaigns: Campaign[] = [
  {
    id: "c1", name: "Summer Collection — Retargeting", status: "ACTIVE",
    spend: 3240, revenue: 15552, roas: 4.8, ctr: 3.2, cpc: 0.87, cpm: 27.90,
    frequency: 2.1, reach: 116129, impressions: 243871, clicks: 7804, conversions: 412,
    audienceOverlap: 14,
    issues: [{ severity: "ok", type: "performance", message: "Strong ROAS at 4.8×", fix: "Increase budget — this campaign is performing well above the 3× target." }],
  },
  {
    id: "c2", name: "New Arrivals — Cold Audience", status: "ACTIVE",
    spend: 5820, revenue: 9312, roas: 1.6, ctr: 0.8, cpc: 2.34, cpm: 18.70,
    frequency: 4.7, reach: 311229, impressions: 1462786, clicks: 2487, conversions: 189,
    audienceOverlap: 38,
    issues: [
      { severity: "critical", type: "ad_fatigue", message: "Ad fatigue: frequency 4.7× (threshold: 3×)", fix: "Rotate creatives immediately. Add 3–5 new ad variations. Consider refreshing the audience." },
      { severity: "critical", type: "poor_roas", message: "ROAS 1.6× — below break-even (2.5×)", fix: "Pause or significantly reduce budget. Review targeting — audience may be too broad. A/B test new angles." },
      { severity: "warning", type: "audience_overlap", message: "38% audience overlap with campaign c3", fix: "Exclude retargeting audiences from this cold audience campaign to avoid cannibalisation." },
    ],
  },
  {
    id: "c3", name: "Brand Awareness — Lookalike 2%", status: "ACTIVE",
    spend: 2100, revenue: 5040, roas: 2.4, ctr: 1.4, cpc: 1.12, cpm: 15.60,
    frequency: 1.8, reach: 134615, impressions: 242307, clicks: 1875, conversions: 98,
    audienceOverlap: 38,
    issues: [
      { severity: "warning", type: "poor_roas", message: "ROAS 2.4× — slightly below 2.5× target", fix: "Test tighter lookalike (1%) to improve audience quality. Review landing page conversion rate." },
      { severity: "warning", type: "audience_overlap", message: "38% overlap with campaign c2", fix: "Add exclusion: exclude people who've seen c2 in the last 30 days." },
    ],
  },
  {
    id: "c4", name: "Product Demo Video — Prospecting", status: "ACTIVE",
    spend: 1480, revenue: 5920, roas: 4.0, ctr: 2.1, cpc: 0.94, cpm: 19.80,
    frequency: 2.4, reach: 74747, impressions: 179393, clicks: 1574, conversions: 124,
    audienceOverlap: 8,
    issues: [{ severity: "ok", type: "performance", message: "Good ROAS at 4.0× with healthy frequency", fix: "Scale budget 20–30% — strong video performance. Test similar creative formats." }],
  },
  {
    id: "c5", name: "Flash Sale — Broad Match", status: "PAUSED",
    spend: 890, revenue: 712, roas: 0.8, ctr: 0.4, cpc: 4.12, cpm: 16.50,
    frequency: 6.2, reach: 53939, impressions: 334212, clicks: 216, conversions: 14,
    audienceOverlap: 52,
    issues: [
      { severity: "critical", type: "poor_roas", message: "ROAS 0.8× — losing money on ad spend", fix: "Do not reactivate without major creative and targeting overhaul. Review product pricing and margins." },
      { severity: "critical", type: "ad_fatigue", message: "Extreme ad fatigue: frequency 6.2×", fix: "Entire creative set needs replacement. Audience is burned out." },
      { severity: "critical", type: "audience_overlap", message: "52% audience overlap — severe cannibalisation", fix: "Consolidate with other campaigns. Remove broad targeting and use specific interest or lookalike audiences." },
    ],
  },
];

const recommendations = [
  { priority: 1, action: "Pause or rebuild 'Flash Sale — Broad Match'", impact: "Stop £890 monthly bleed (0.8× ROAS)", severity: "critical" as Severity },
  { priority: 2, action: "Rotate creatives on 'New Arrivals' immediately", impact: "Frequency 4.7× causing significant CPM inflation", severity: "critical" as Severity },
  { priority: 3, action: "Scale 'Summer Collection Retargeting' +30%", impact: "4.8× ROAS — estimated +£1,800 revenue per £375 additional spend", severity: "ok" as Severity },
  { priority: 4, action: "Reduce audience overlap between c2 and c3", impact: "38% overlap is cannibalising both campaigns", severity: "warning" as Severity },
  { priority: 5, action: "Test 1% lookalike on 'Brand Awareness'", impact: "Could improve ROAS from 2.4× to 3×+", severity: "warning" as Severity },
];

const severityConfig = {
  critical: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", icon: XCircle },
  warning: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", icon: AlertCircle },
  ok: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", icon: CheckCircle },
};

function roasColor(roas: number) {
  if (roas >= 3) return "#34d399";
  if (roas >= 2) return "#fbbf24";
  return "#f87171";
}

function freqColor(freq: number) {
  if (freq <= 2.5) return "#34d399";
  if (freq <= 4) return "#fbbf24";
  return "#f87171";
}

export default function AuditPage() {
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
  const blendedRoas = totalRevenue / totalSpend;
  const criticalCount = campaigns.flatMap(c => c.issues).filter(i => i.severity === "critical").length;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: "rgba(7,7,15,0.9)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1877f2, #42a5f5)" }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-white text-sm">Meta Ads Audit</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>Demo</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs" style={{ color: "#475569" }}>Mock account data · May 2024</span>
            <a href="https://github.com/itanvirt/demo-meta-ads-audit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ color: "#94a3b8", border: "1px solid var(--border)" }}>
              <ExternalLink size={11} /> Source
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Spend", value: `£${totalSpend.toLocaleString()}`, icon: DollarSign, color: "#94a3b8" },
            { label: "Total Revenue", value: `£${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "#34d399" },
            { label: "Blended ROAS", value: `${blendedRoas.toFixed(1)}×`, icon: BarIcon, color: roasColor(blendedRoas) },
            { label: "Critical Issues", value: String(criticalCount), icon: AlertTriangle, color: "#f87171" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-4 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Icon size={15} className="mb-3" style={{ color: "#475569" }} />
              <p className="text-xl font-bold mb-0.5" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: "#475569" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Priority Recommendations */}
        <div className="p-6 rounded-2xl mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={15} style={{ color: "#fbbf24" }} />
            <h2 className="font-semibold text-white text-sm">Priority Actions</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
              {criticalCount} critical
            </span>
          </div>
          <div className="space-y-3">
            {recommendations.map((r) => {
              const cfg = severityConfig[r.severity];
              const Icon = cfg.icon;
              return (
                <div key={r.priority} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <span className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "#64748b" }}>
                    {r.priority}
                  </span>
                  <Icon size={14} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{r.action}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{r.impact}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Table */}
        <div className="p-6 rounded-2xl mb-6" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white text-sm">Campaign Performance</h2>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#475569" }}>
              <Eye size={12} /> 5 campaigns · Meta Ads API
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Campaign", "Status", "Spend", "ROAS", "CTR", "Frequency", "Overlap", "Issues"].map(h => (
                    <th key={h} className="text-left pb-3 text-xs font-medium pr-4 whitespace-nowrap" style={{ color: "#475569" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => {
                  const criticals = c.issues.filter(x => x.severity === "critical").length;
                  const warnings = c.issues.filter(x => x.severity === "warning").length;
                  return (
                    <tr key={c.id} style={{ borderBottom: i < campaigns.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <td className="py-3 pr-4 font-medium text-white text-xs max-w-[180px] truncate">{c.name}</td>
                      <td className="py-3 pr-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                          background: c.status === "ACTIVE" ? "rgba(52,211,153,0.1)" : "rgba(100,116,139,0.1)",
                          color: c.status === "ACTIVE" ? "#34d399" : "#64748b",
                        }}>{c.status}</span>
                      </td>
                      <td className="py-3 pr-4 text-xs" style={{ color: "#94a3b8" }}>£{c.spend.toLocaleString()}</td>
                      <td className="py-3 pr-4 text-xs font-bold" style={{ color: roasColor(c.roas) }}>{c.roas}×</td>
                      <td className="py-3 pr-4 text-xs" style={{ color: "#94a3b8" }}>{c.ctr}%</td>
                      <td className="py-3 pr-4 text-xs font-medium" style={{ color: freqColor(c.frequency) }}>{c.frequency}×</td>
                      <td className="py-3 pr-4 text-xs" style={{ color: c.audienceOverlap > 30 ? "#fbbf24" : "#64748b" }}>{c.audienceOverlap}%</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          {criticals > 0 && <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>{criticals} crit</span>}
                          {warnings > 0 && <span className="px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>{warnings} warn</span>}
                          {criticals === 0 && warnings === 0 && <span className="text-xs" style={{ color: "#34d399" }}>✓ OK</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Issues */}
        <div className="space-y-4 mb-8">
          <h2 className="font-semibold text-white text-sm">Detailed Issue Breakdown</h2>
          {campaigns.filter(c => c.issues.some(i => i.severity !== "ok")).map((c) => (
            <div key={c.id} className="p-5 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <p className="font-medium text-white text-sm mb-3">{c.name}</p>
              <div className="space-y-2">
                {c.issues.filter(i => i.severity !== "ok").map((issue, j) => {
                  const cfg = severityConfig[issue.severity];
                  const Icon = cfg.icon;
                  return (
                    <div key={j} className="p-3 rounded-xl" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                      <div className="flex items-start gap-2">
                        <Icon size={13} className="shrink-0 mt-0.5" style={{ color: cfg.color }} />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: cfg.color }}>{issue.message}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>→ {issue.fix}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* How this works */}
        <div className="p-6 rounded-2xl mb-8" style={{ border: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.04)" }}>
          <h2 className="font-semibold text-white text-sm mb-3">How this audit tool works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-xs" style={{ color: "#64748b" }}>
            <div>
              <p className="font-semibold mb-1" style={{ color: "#a78bfa" }}>1. Connect via OAuth</p>
              <p>User authenticates with Meta via OAuth 2.0. Access token stored server-side — never exposed to the client.</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: "#a78bfa" }}>2. Fetch campaign data</p>
              <p>Pulls campaign, adset, and ad-level data from the Meta Marketing API. Calculates derived metrics: frequency-adjusted CPM, effective ROAS.</p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: "#a78bfa" }}>3. Generate audit</p>
              <p>Rule engine flags issues by comparing metrics against configurable thresholds. Prioritised fix recommendations generated automatically.</p>
            </div>
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-xs" style={{ color: "#334155" }}>
            Demo by <a href="https://tanviratuhin.com" style={{ color: "#7c3aed" }}>Tanvir Tuhin</a>
            {" "}· All data is mock · <a href="https://github.com/itanvirt/demo-meta-ads-audit" style={{ color: "#7c3aed" }}>View source</a>
          </p>
        </div>
      </main>
    </div>
  );
}

function BarIcon({ size, style, className }: { size: number; style?: React.CSSProperties; className?: string }) {
  return <TrendingUp size={size} style={style} className={className} />;
}
