"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { HARD_SKILL_DOMAINS, SOFT_SKILL_DOMAINS } from "@/lib/types";

interface SkillData {
  H1?: number;
  H2?: number;
  H3?: number;
  H4?: number;
  H5?: number;
  H6?: number;
  S1?: number;
  S2?: number;
  S3?: number;
  S4?: number;
  S5?: number;
  S6?: number;
}

interface SkillSpiderGraphProps {
  hardSkills: SkillData;
  softSkills: SkillData;
  type: "hard" | "soft";
}

const HARD_SKILL_LABELS = {
  H1: "Data Science & AI",
  H2: "Digital Dev & Security",
  H3: "Tech PM & Process",
  H4: "Financial Modeling",
  H5: "Tech Operations",
  H6: "Regulatory & Compliance",
};

const SOFT_SKILL_LABELS = {
  S1: "Analytical Thinking",
  S2: "Communication",
  S3: "Leadership",
  S4: "Adaptability",
  S5: "Creativity",
  S6: "Service Orientation",
};

export function SkillSpiderGraph({
  hardSkills,
  softSkills,
  type,
}: SkillSpiderGraphProps) {
  const skillData = type === "hard" ? hardSkills : softSkills;
  const labels = type === "hard" ? HARD_SKILL_LABELS : SOFT_SKILL_LABELS;
  const color = type === "hard" ? "#3b82f6" : "#10b981"; // blue for hard, green for soft
  const fillColor = type === "hard" ? "#3b82f680" : "#10b98180";

  // Transform data for Recharts
  const chartData = Object.entries(labels).map(([key, label]) => ({
    skill: label,
    value: skillData[key as keyof SkillData] || 0,
    fullMark: 100,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={chartData}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: "#666", fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#999", fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Skill Level"
            dataKey="value"
            stroke={color}
            fill={fillColor}
            fillOpacity={0.6}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border">
                    <p className="font-medium text-sm">
                      {payload[0].payload.skill}
                    </p>
                    <p className="text-lg font-bold" style={{ color }}>
                      {payload[0].value}/100
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Skill Details */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {Object.entries(labels).map(([key, label]) => {
          const score = skillData[key as keyof SkillData] || 0;
          const fullDomainName =
            type === "hard"
              ? HARD_SKILL_DOMAINS[key as keyof typeof HARD_SKILL_DOMAINS]
              : SOFT_SKILL_DOMAINS[key as keyof typeof SOFT_SKILL_DOMAINS];

          return (
            <div key={key} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700">
                  {fullDomainName}
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${score}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
              <div className="text-sm font-bold" style={{ color }}>
                {score}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
