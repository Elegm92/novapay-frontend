import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import { getDSStats } from "../../services/api.js";
import styles from "./RiskMap.module.css";

const COUNTRY_COLORS = [
  "#4A0072",
  "#5B1480",
  "#6B2D8B",
  "#7B3A96",
  "#8B4FA4",
  "#9A63B1",
  "#A970BD",
  "#B985C9",
];

const CATEGORY_COLORS = [
  "#0D2D4A",
  "#17405F",
  "#1F5475",
  "#276892",
  "#2F7CAF",
  "#3485B6",
  "#41A3DA",
  "#75CDF6",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipName}>{data.name}</p>

        <p className={styles.tooltipValue}>Risk: {data.risk}%</p>
      </div>
    );
  }

  return null;
};

function RiskMap() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDSStats();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className={styles.loading}>Loading risk map...</p>;
  }

  if (error) {
    return <p className={styles.error}>No data available</p>;
  }

  // ALL SEGMENTS SAME SIZE
  // COLOR REPRESENTS RISK LEVEL

  const countryData =
    stats?.top_risky_countries?.map((d) => ({
      name: d.country,
      value: 1,
      risk: parseFloat((d.fraud_rate * 100).toFixed(1)),
    })) || [];

  const categoryData =
    stats?.top_risky_categories?.map((d) => ({
      name: d.category,
      value: 1,
      risk: parseFloat((d.fraud_rate * 100).toFixed(1)),
    })) || [];

  return (
    <article className={styles.riskMap}>
      <header className={styles.riskMapHeader}>
        <h3>Risk Map</h3>
      </header>

      <div className={styles.chartContent}>
        {/* CHART */}
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              {/* COUNTRIES */}
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                outerRadius={140}
                innerRadius={100}
                dataKey="value"
                paddingAngle={5}
                label={false}
                labelLine={false}
              >
                {countryData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={COUNTRY_COLORS[i % COUNTRY_COLORS.length]}
                  />
                ))}
              </Pie>

              {/* CATEGORIES */}
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                paddingAngle={5}
                label={false}
                labelLine={false}
              >
                {categoryData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BOTTOM LEGEND */}
        <div className={styles.bottomLegend}>
          {/* COUNTRIES */}
          <div className={styles.legendGroup}>
            <h4>Countries</h4>

            <div className={styles.legendInline}>
              {countryData.map((item, i) => (
                <div key={i} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{
                      background: COUNTRY_COLORS[i % COUNTRY_COLORS.length],
                    }}
                  />

                  <span className={styles.legendText}>{item.name}</span>

                  <strong>{item.risk}%</strong>
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div className={styles.legendGroup}>
            <h4>Categories</h4>

            <div className={styles.legendInline}>
              {categoryData.map((item, i) => (
                <div key={i} className={styles.legendItem}>
                  <span
                    className={styles.legendColor}
                    style={{
                      background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                    }}
                  />

                  <span className={styles.legendText}>{item.name}</span>

                  <strong>{item.risk}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default RiskMap;
