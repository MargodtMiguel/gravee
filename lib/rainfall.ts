export function getRainfallSummary(precipitationSum: number[]): string {
  const totalRainfall = precipitationSum.reduce((acc, curr) => acc + curr, 0);

  if (totalRainfall < 2) {
    return "Droog";
  } else if (totalRainfall < 10) {
    return "Een beetje regen";
  } else if (totalRainfall < 30) {
    return "Regenachtig";
  } else {
    return "Veel regen";
  }
}
