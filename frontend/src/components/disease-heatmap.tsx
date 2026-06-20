// components/disease-heatmap.tsx — Disease × Severity intensity heatmap
//
// Switched away from a real geographic (state-level) map because there's no
// region/state column anywhere in the database yet. This version is fully
// live right now: it groups disease_reports by disease_name + severity and
// shades each cell darker blue based on how many reports fall into it.
// No extra libraries needed (dropped react-simple-maps + d3-scale).
"use client"


import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";

// Shape of a single row coming from Supabase
type DiseaseReportRow = {
  disease_name: string
  severity: string | null
}

// The three severity columns we always show, left to right
const SEVERITY_LEVELS = ["Low", "Medium", "High"]

export function DiseaseHeatmap() {
  const [reports, setReports] = useState<DiseaseReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch all disease reports once on mount
  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from("disease_reports")
        .select("disease_name, severity")

      if (error) {
        setError("Could not load heatmap data.")
        setLoading(false)
        return
      }

      setReports((data as DiseaseReportRow[]) || [])
      setLoading(false)
    }

    fetchReports()
  }, [])

  // Build a list of unique disease names, in the order they first appear
  const diseases = Array.from(new Set(reports.map((r) => r.disease_name)))

  // Build a lookup: counts[disease][severity] = number of matching reports
  const counts: Record<string, Record<string, number>> = {}
  diseases.forEach((d) => {
    counts[d] = { Low: 0, Medium: 0, High: 0 }
  })
  reports.forEach((r) => {
    const sev = r.severity || "Low"
    if (counts[r.disease_name]) {
      counts[r.disease_name][sev] = (counts[r.disease_name][sev] || 0) + 1
    }
  })

  // Find the highest single cell value, used to scale color intensity
  const maxCount = Math.max(
    1, // avoid divide-by-zero if there's no data yet
    ...diseases.flatMap((d) => SEVERITY_LEVELS.map((s) => counts[d][s]))
  )

  // Turns a count into a background color — more reports = darker blue.
  // We interpolate manually between a light blue and your theme's dark blue,
  // so no extra color-scale library is needed.
  function cellColor(count: number) {
    if (count === 0) return "#f3f4f6" // gray-100, no data
    const intensity = count / maxCount // 0 to 1
    // Interpolate between blue-100 (#dbeafe) and theme blue-900 (#1e3a8a)
    const from = [219, 234, 254]
    const to = [30, 58, 138]
    const rgb = from.map((start, i) => Math.round(start + (to[i] - start) * intensity))
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">Disease Severity Heatmap</h2>
        <span className="text-xs text-gray-400">Live from reported cases</span>
      </div>

      {/* Loading / error / empty states */}
      {loading && <p className="text-xs text-gray-400">Loading heatmap…</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!loading && !error && diseases.length === 0 && (
        <p className="text-xs text-gray-400">No disease reports yet.</p>
      )}

      {/* The grid itself — scrolls horizontally on small screens */}
      {!loading && !error && diseases.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate" style={{ borderSpacing: "4px" }}>
            <thead>
              <tr>
                <th className="text-left text-gray-400 font-medium pb-1">Disease</th>
                {SEVERITY_LEVELS.map((sev) => (
                  <th key={sev} className="text-center text-gray-400 font-medium pb-1 px-2">
                    {sev}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {diseases.map((disease) => (
                <tr key={disease}>
                  <td className="text-gray-700 font-medium pr-3 py-1 whitespace-nowrap">{disease}</td>
                  {SEVERITY_LEVELS.map((sev) => {
                    const count = counts[disease][sev]
                    return (
                      <td key={sev} className="p-0">
                        <div
                          className="w-16 h-10 rounded-md flex items-center justify-center text-xs font-semibold mx-auto"
                          style={{
                            backgroundColor: cellColor(count),
                            color: count / maxCount > 0.5 ? "#ffffff" : "#374151", // readable text on dark cells
                          }}
                        >
                          {count}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-xs text-gray-400">Fewer reports</span>
        <div
          className="flex-1 h-2 rounded-full"
          style={{ background: "linear-gradient(to right, #dbeafe, #1e3a8a)" }}
        />
        <span className="text-xs text-gray-400">More reports</span>
      </div>
    </div>
  )
}