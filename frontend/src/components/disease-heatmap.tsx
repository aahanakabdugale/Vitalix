// components/disease-heatmap.tsx — State-level India disease density map
// Uses react-simple-maps + a public India-states GeoJSON file.
// Dummy data for now — swap stateCaseData for live Supabase data later.
"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { scaleLinear } from "d3-scale"

// Public GeoJSON of Indian states — each feature has a "st_nm" property with the state name
const INDIA_GEO_URL =
  "https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson"

// ── Dummy case counts per state ───────────────────────────────────
// Keys MUST match the "st_nm" values in the GeoJSON exactly.
const stateCaseData: Record<string, number> = {
  Maharashtra: 136,
  Karnataka: 64,
  "Tamil Nadu": 58,
  Kerala: 47,
  Gujarat: 39,
  "Uttar Pradesh": 82,
  "Madhya Pradesh": 30,
  Rajasthan: 28,
  "West Bengal": 51,
  Bihar: 22,
  Delhi: 19,
  Punjab: 15,
  Telangana: 33,
  "Andhra Pradesh": 25,
  Odisha: 18,
  Assam: 9,
}

// Color scale: light blue (low cases) → dark blue (high cases), matching your theme
const maxCases = Math.max(...Object.values(stateCaseData))
const colorScale = scaleLinear<string>()
  .domain([0, maxCases])
  .range(["#dbeafe", "#1e3a8a"]) // blue-100 → blue-900

export function DiseaseHeatmap() {
  // Tracks which state is currently hovered, to show its name + case count
  const [hovered, setHovered] = useState<{ name: string; cases: number } | null>(null)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-900">India Disease Density Map</h2>
        <span className="text-xs text-gray-400">State-wise reported cases</span>
      </div>

      {/* Hover info line — shows whichever state the mouse is over */}
      <p className="text-xs text-gray-500 mb-3 h-4">
        {hovered
          ? <>Hovering: <span className="font-semibold text-gray-800">{hovered.name}</span> — {hovered.cases} cases</>
          : "Hover over a state to see case count"}
      </p>

      {/* The map itself */}
      <div className="w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 1000, center: [82, 22] }}
          width={800}
          height={700}
          className="w-full h-auto"
        >
          <Geographies geography={INDIA_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties.st_nm as string
                const cases = stateCaseData[stateName] ?? 0
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHovered({ name: stateName, cases })}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: {
                        fill: cases > 0 ? colorScale(cases) : "#f3f4f6", // gray-100 for no data
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: "#2563eb", // your theme blue, highlight on hover
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#1e40af",
                        outline: "none",
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs text-gray-400">Low</span>
        <div className="flex-1 h-2 rounded-full" style={{
          background: `linear-gradient(to right, ${colorScale(0)}, ${colorScale(maxCases)})`
        }} />
        <span className="text-xs text-gray-400">High</span>
      </div>
    </div>
  )
}