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
        <p className={styles.tooltipValue}>Fraud cases: {data.risk}</p>
      </div>
    );
  }
  return null;
};

function RiskMap() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radii, setRadii] = useState({
    outerA: 85,
    innerA: 58,
    outerB: 50,
    innerB: 25,
  });

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

  useEffect(() => {
    const updateRadii = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setRadii({ outerA: 110, innerA: 78, outerB: 70, innerB: 38 });
      } else if (w >= 640) {
        setRadii({ outerA: 90, innerA: 62, outerB: 55, innerB: 28 });
      } else {
        setRadii({ outerA: 70, innerA: 48, outerB: 42, innerB: 20 });
      }
    };
    updateRadii();
    window.addEventListener("resize", updateRadii);
    return () => window.removeEventListener("resize", updateRadii);
  }, []);

  if (loading) return <p className={styles.loading}>Cargando...</p>;
  if (error) return <p className={styles.error}>No data available</p>;

  const countryData =
    stats?.top_dangerous_countries?.map((d) => ({
      name: d.country,
      value: 1,
      risk: d.fraud_cases,
    })) || [];

  const categoryData =
    stats?.top_dangerous_categories?.map((d) => ({
      name: d.category,
      value: 1,
      risk: d.fraud_cases,
    })) || [];

  return (
    <article className={styles.riskMap}>
      <header className={styles.riskMapHeader}>
        <h3>Mapa de Riesgo</h3>
      </header>

      <div className={styles.chartContent}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={260} minHeight={260}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                outerRadius={radii.outerA}
                innerRadius={radii.innerA}
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

              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={radii.outerB}
                innerRadius={radii.innerB}
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

              <Tooltip isAnimationActive={false} content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.bottomLegend}>
          <div className={styles.legendGroup}>
            <h4>Top países por fraude</h4>
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
                  <strong>{item.risk}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.legendGroup}>
            <h4>Top categorías por fraude</h4>
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
                  <strong>{item.risk}</strong>
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
