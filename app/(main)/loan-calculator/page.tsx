"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type LoanType = "home" | "lap" | "construction" | "balance";

const LOAN_TYPES: { key: LoanType; label: string; desc: string; icon: string; color: string }[] = [
  { key: "home",         label: "Home Loan",             desc: "Buy your dream home",    icon: "🏠", color: "#f59e0b" },
  { key: "lap",          label: "Loan Against Property", desc: "Unlock property value",  icon: "🏢", color: "#3b82f6" },
  { key: "construction", label: "Construction Loan",     desc: "Build from scratch",     icon: "🏗️", color: "#10b981" },
  { key: "balance",      label: "Balance Transfer",      desc: "Switch for lower rates", icon: "🔄", color: "#8b5cf6" },
];

const LOAN_DEFAULTS: Record<LoanType, {
  minAmount: number; maxAmount: number;
  minRate: number;   maxRate: number;
  minTenure: number; maxTenure: number;
  defaultAmount: number; defaultRate: number; defaultTenure: number;
}> = {
  home:         { minAmount: 100000,   maxAmount: 100000000, minRate: 6.5, maxRate: 14, minTenure: 1, maxTenure: 30, defaultAmount: 5000000,  defaultRate: 8.5,  defaultTenure: 20 },
  lap:          { minAmount: 1000000,  maxAmount: 500000000, minRate: 8,   maxRate: 16, minTenure: 1, maxTenure: 20, defaultAmount: 10000000, defaultRate: 10.5, defaultTenure: 15 },
  construction: { minAmount: 100000,   maxAmount: 50000000,  minRate: 7,   maxRate: 14, minTenure: 1, maxTenure: 20, defaultAmount: 3000000,  defaultRate: 9.0,  defaultTenure: 15 },
  balance:      { minAmount: 1000000,  maxAmount: 100000000, minRate: 6.5, maxRate: 13, minTenure: 1, maxTenure: 30, defaultAmount: 5000000,  defaultRate: 7.5,  defaultTenure: 15 },
};

// ─── Non-linear amount scale ──────────────────────────────────────────────────
// Steps: 1L, 5L, 10L, 20L, 30L, 50L, 75L, 1Cr, 1.5Cr, 2Cr, 3Cr, 5Cr, 7.5Cr, 10Cr, 15Cr, 20Cr, 30Cr, 50Cr
const AMOUNT_STEPS = [
  100000, 500000, 1000000, 2000000, 3000000, 5000000, 7500000,
  10000000, 15000000, 20000000, 30000000, 50000000, 75000000,
  100000000, 150000000, 200000000, 300000000, 500000000,
];

function amountToSlider(amount: number, steps: number[]): number {
  const clamped = Math.min(Math.max(amount, steps[0]), steps[steps.length - 1]);
  for (let i = 0; i < steps.length - 1; i++) {
    if (clamped >= steps[i] && clamped <= steps[i + 1]) {
      const t = (clamped - steps[i]) / (steps[i + 1] - steps[i]);
      return i + t;
    }
  }
  return steps.length - 1;
}

function sliderToAmount(pos: number, steps: number[]): number {
  const i = Math.floor(pos);
  const t = pos - i;
  if (i >= steps.length - 1) return steps[steps.length - 1];
  return Math.round(steps[i] + t * (steps[i + 1] - steps[i]));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatINR(val: number): string {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (val >= 100000)   return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function parseINR(raw: string): number | null {
  const s = raw.replace(/[₹,\s]/g, "").toLowerCase();
  const crMatch = s.match(/^([\d.]+)\s*cr?$/);
  if (crMatch) return Math.round(parseFloat(crMatch[1]) * 10000000);
  const lMatch = s.match(/^([\d.]+)\s*l(?:akh)?$/);
  if (lMatch) return Math.round(parseFloat(lMatch[1]) * 100000);
  const plain = parseFloat(s);
  if (!isNaN(plain)) return Math.round(plain);
  return null;
}

function calcEMI(principal: number, annualRate: number, tenureYears: number) {
  const r = annualRate / 12 / 100;
  const n = tenureYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ principal, interest, color }: { principal: number; interest: number; color: string }) {
  const total = principal + interest;
  const SIZE = 200, R = 75, CX = 100, CY = 100;
  const circ = 2 * Math.PI * R;
  const pPct = principal / total;
  const pDash = pPct * circ;
  const gap = 3;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#1f2937" strokeWidth="28" />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#374151" strokeWidth="28"
            strokeDasharray={`${circ - pDash - gap} ${pDash + gap}`}
            strokeDashoffset={-(pDash - gap / 2)}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.7s ease" }}
            transform={`rotate(-90 ${CX} ${CY})`} />
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth="28"
            strokeDasharray={`${pDash - gap} ${circ - pDash + gap}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.7s ease" }}
            transform={`rotate(-90 ${CX} ${CY})`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400 font-medium">Total</span>
          <span className="text-lg font-extrabold text-white leading-tight">{formatINR(total)}</span>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
          <div>
            <p className="text-xs text-gray-400">Principal</p>
            <p className="text-sm font-bold text-white">{formatINR(principal)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Interest</p>
            <p className="text-sm font-bold text-white">{formatINR(Math.round(interest))}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Amortisation Bar Chart ───────────────────────────────────────────────────

function AmortChart({ principal, annualRate, tenureYears, color }: { principal: number; annualRate: number; tenureYears: number; color: string }) {
  const years = Math.min(tenureYears, 30);
  const r = annualRate / 12 / 100;
  const emi = calcEMI(principal, annualRate, tenureYears);
  const data: { year: number; principalPaid: number; interestPaid: number }[] = [];
  let balance = principal;
  for (let y = 1; y <= years; y++) {
    let yP = 0, yI = 0;
    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const ip = balance * r;
      const pp = Math.min(emi - ip, balance);
      yI += ip; yP += pp; balance -= pp;
    }
    data.push({ year: y, principalPaid: yP, interestPaid: yI });
  }
  const maxBar = Math.max(...data.map((d) => d.principalPaid + d.interestPaid));
  return (
    <div className="w-full">
      <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Yearly Breakdown</p>
      <div className="flex items-end gap-1 h-32 w-full">
        {data.map((d, i) => {
          const totalH = ((d.principalPaid + d.interestPaid) / maxBar) * 100;
          const pctP = d.principalPaid / (d.principalPaid + d.interestPaid);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              <div className="w-full flex flex-col justify-end rounded-t-sm overflow-hidden cursor-pointer"
                style={{ height: `${totalH}%` }}
                title={`Year ${d.year}: P ${formatINR(d.principalPaid)}, I ${formatINR(d.interestPaid)}`}>
                <div className="w-full" style={{ height: `${(1 - pctP) * 100}%`, background: "#374151" }} />
                <div className="w-full" style={{ height: `${pctP * 100}%`, background: color }} />
              </div>
              {(i === 0 || (i + 1) % Math.ceil(years / 6) === 0) && (
                <span className="text-[9px] text-gray-600 mt-1">{d.year}yr</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
          <span className="text-xs text-gray-500">Principal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-gray-600" />
          <span className="text-xs text-gray-500">Interest</span>
        </div>
      </div>
    </div>
  );
}

// ─── SmartSlider: slider + type-in input ──────────────────────────────────────

interface SmartSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  nonLinearSteps?: number[];
  placeholder?: string;
  parseInput?: (raw: string) => number | null;
  color: string;
}

function SmartSlider({
  label, value, min, max, step, onChange, format,
  nonLinearSteps, placeholder, parseInput, color,
}: SmartSliderProps) {
  const [inputVal, setInputVal] = useState("");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(false);

  const sliderMax = nonLinearSteps ? nonLinearSteps.length - 1 : max;
  const sliderMin = 0;
  const sliderStep = nonLinearSteps ? 0.01 : step;

  const sliderValue = nonLinearSteps ? amountToSlider(value, nonLinearSteps) : value;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pos = parseFloat(e.target.value);
    const actual = nonLinearSteps ? sliderToAmount(pos, nonLinearSteps) : pos;
    onChange(Math.min(Math.max(actual, min), max));
    setEditing(false);
    setError(false);
  };

  const handleInputFocus = () => {
    setEditing(true);
    setInputVal(nonLinearSteps
      ? String(Math.round(value / 100000) * 100000 === value
          ? value >= 10000000 ? (value / 10000000).toFixed(2) + " Cr" : (value / 100000).toFixed(2) + " L"
          : value)
      : String(value));
    setError(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setError(false);
  };

  const commit = () => {
    setEditing(false);
    if (!inputVal.trim()) return;
    const parsed = parseInput ? parseInput(inputVal) : parseFloat(inputVal.replace(/,/g, ""));
    if (parsed === null || isNaN(parsed as number) || (parsed as number) < min || (parsed as number) > max) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    onChange(parsed as number);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") { setEditing(false); setInputVal(""); setError(false); }
  };

  const pct = ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold text-gray-400 tracking-widest uppercase flex-shrink-0">{label}</label>
        <div className="flex items-center gap-2">
          {editing ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={inputVal}
                onChange={handleInputChange}
                onBlur={commit}
                onKeyDown={handleKeyDown}
                placeholder={placeholder || format(value)}
                className={`w-32 px-2.5 py-1 rounded-lg text-sm font-bold text-right outline-none transition-all border ${
                  error
                    ? "border-red-500 bg-red-950 text-red-400"
                    : "border-amber-400/50 bg-gray-800 text-white focus:border-amber-400"
                }`}
              />
              <button
                onMouseDown={(e) => { e.preventDefault(); commit(); }}
                className="text-[10px] px-2 py-1 bg-amber-400 text-gray-900 font-bold rounded-lg hover:bg-amber-300 transition-colors"
              >
                ✓
              </button>
            </div>
          ) : (
            <button
              onClick={handleInputFocus}
              className="text-sm font-extrabold text-white hover:text-amber-400 transition-colors border border-transparent hover:border-amber-400/30 px-2 py-0.5 rounded-lg"
              title="Click to type a value"
            >
              {format(value)}
              <span className="ml-1 text-[9px] text-gray-600">✎</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-[10px] text-red-400 text-right">
          Enter a value between {format(min)} and {format(max)}
        </p>
      )}

      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 bg-gray-800 rounded-full" />
        <div
          className="absolute h-1.5 rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          step={sliderStep}
          value={sliderValue}
          onChange={handleSliderChange}
          className="absolute w-full appearance-none bg-transparent cursor-pointer"
          style={{ "--loan-color": color } as any}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-600">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LoanCalculatorPage() {
  const [activeType, setActiveType] = useState<LoanType>("home");
  const defaults = LOAN_DEFAULTS[activeType];
  const activeConfig = LOAN_TYPES.find((l) => l.key === activeType)!;
  const color = activeConfig.color;

  const [amount, setAmount] = useState(defaults.defaultAmount);
  const [rate, setRate] = useState(defaults.defaultRate);
  const [tenure, setTenure] = useState(defaults.defaultTenure);

  const handleTypeChange = (type: LoanType) => {
    setActiveType(type);
    const d = LOAN_DEFAULTS[type];
    setAmount(d.defaultAmount);
    setRate(d.defaultRate);
    setTenure(d.defaultTenure);
  };

  // Filter AMOUNT_STEPS to only those within the current loan type's range
  const amountSteps = useMemo(
    () => AMOUNT_STEPS.filter((s) => s >= defaults.minAmount && s <= defaults.maxAmount),
    [defaults.minAmount, defaults.maxAmount]
  );

  const emi = useMemo(() => calcEMI(amount, rate, tenure), [amount, rate, tenure]);
  const totalPayable = emi * tenure * 12;
  const totalInterest = totalPayable - amount;

  return (
    <div className="min-h-screen bg-gray-950 text-white" style={{ "--loan-color": color } as any}>

      {/* ── Header ── */}
      <div className="border-b border-white/5 bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </a>
            <span className="text-gray-700">|</span>
            <span className="text-sm font-bold text-white">Loan Calculator</span>
          </div>
          <img src="/nobglogo.png" alt="PROPOYE" className="h-8 w-auto object-contain opacity-70 brightness-0 invert" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">

        {/* ── Page title ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Free Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Loan <span style={{ color }}>Calculator</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Estimate your EMI, total interest, and repayment schedule across all major loan types.
          </p>
        </motion.div>

        {/* ── Loan type tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10"
        >
          {LOAN_TYPES.map((lt) => (
            <button
              key={lt.key}
              onClick={() => handleTypeChange(lt.key)}
              className={`flex flex-col items-start gap-1.5 px-5 py-4 rounded-2xl border transition-all duration-300 text-left ${
                activeType === lt.key ? "border-transparent shadow-lg" : "bg-gray-900 border-white/5 hover:border-white/10"
              }`}
              style={activeType === lt.key
                ? { background: `${lt.color}18`, borderColor: `${lt.color}50`, boxShadow: `0 0 20px ${lt.color}20` }
                : {}}
            >
              <span className="text-2xl">{lt.icon}</span>
              <span className="text-sm font-bold text-white leading-tight">{lt.label}</span>
              <span className="text-xs text-gray-500">{lt.desc}</span>
            </button>
          ))}
        </motion.div>

        {/* ── Main layout ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* ── Left: Inputs ── */}
            <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{activeConfig.icon}</span>
                <div>
                  <h2 className="text-lg font-extrabold text-white">{activeConfig.label}</h2>
                  <p className="text-xs text-gray-500">{activeConfig.desc}</p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* Hint text */}
              <p className="text-[11px] text-gray-600 -mt-4">
                💡 Drag the sliders or <span className="text-amber-400/80">click any value</span> to type it directly
              </p>

              {/* Loan Amount — non-linear */}
              <SmartSlider
                label="Loan Amount"
                value={amount}
                min={defaults.minAmount}
                max={defaults.maxAmount}
                step={100000}
                onChange={setAmount}
                format={formatINR}
                nonLinearSteps={amountSteps}
                placeholder="e.g. 50L or 1.5Cr"
                parseInput={parseINR}
                color={color}
              />

              {/* Interest Rate — linear */}
              <SmartSlider
                label="Interest Rate (% p.a.)"
                value={rate}
                min={defaults.minRate}
                max={defaults.maxRate}
                step={0.1}
                onChange={setRate}
                format={(v) => `${v.toFixed(1)}%`}
                placeholder="e.g. 8.5"
                parseInput={(s) => {
                  const n = parseFloat(s.replace("%", ""));
                  return isNaN(n) ? null : n;
                }}
                color={color}
              />

              {/* Tenure — linear */}
              <SmartSlider
                label="Loan Tenure"
                value={tenure}
                min={defaults.minTenure}
                max={defaults.maxTenure}
                step={1}
                onChange={setTenure}
                format={(v) => `${v} yr`}
                placeholder="e.g. 20"
                parseInput={(s) => {
                  const n = parseInt(s.replace(/[^0-9]/g, ""));
                  return isNaN(n) ? null : n;
                }}
                color={color}
              />

              <div className="h-px bg-white/5" />

              {/* EMI result */}
              <div className="rounded-2xl p-6 text-center" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Monthly EMI</p>
                <p className="text-4xl font-extrabold" style={{ color, fontFamily: "'Playfair Display', serif" }}>
                  {formatINR(Math.round(emi))}
                </p>
                <p className="text-xs text-gray-500 mt-2">per month for {tenure} year{tenure !== 1 ? "s" : ""}</p>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Principal",       value: formatINR(amount) },
                  { label: "Total Interest",  value: formatINR(Math.round(totalInterest)) },
                  { label: "Total Payable",   value: formatINR(Math.round(totalPayable)) },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-800 rounded-2xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">{s.label}</p>
                    <p className="text-xs font-extrabold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Charts ── */}
            <div className="flex flex-col gap-6">
              <div className="bg-gray-900 border border-white/5 rounded-3xl p-8 flex flex-col items-center">
                <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6 self-start">
                  Principal vs Interest
                </p>
                <DonutChart principal={amount} interest={Math.round(totalInterest)} color={color} />
              </div>
              <div className="bg-gray-900 border border-white/5 rounded-3xl p-8">
                <AmortChart principal={amount} annualRate={rate} tenureYears={tenure} color={color} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-gray-600 text-xs mt-10 max-w-2xl mx-auto">
          * This calculator provides an estimate only. Actual EMI may vary based on your lender's terms, processing fees, and applicable taxes. Please consult a financial advisor before making any decisions.
        </p>
      </div>

      <style jsx global>{`
        input[type='range'] { -webkit-appearance: none; }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: var(--loan-color, #f59e0b);
          border: 3px solid #111827;
          cursor: pointer;
          box-shadow: 0 0 8px var(--loan-color, #f59e0b);
          transition: transform 0.15s ease;
        }
        input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.2); }
        input[type='range']::-moz-range-thumb {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: var(--loan-color, #f59e0b);
          border: 3px solid #111827;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}