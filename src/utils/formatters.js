export const formatStepAsTime = (step) => {
  if (step == null || Number.isNaN(Number(step))) return "—";

  const totalMinutes = Number(step);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}:${String(minutes).padStart(2, "0")}`;
};

export const formatNumber = (value) => {
  if (value == null || value === "" || Number.isNaN(Number(value))) {
    return "—";
  }
  return Number(value).toLocaleString("es-ES", {
    useGrouping: true
  });
};

export const formatCurrency = (value) => {
  if (value == null || value === "" || Number.isNaN(Number(value))) {
    return "$—";
  }
  return `$${Number(value).toLocaleString("es-ES", { useGrouping: true })}`;
};