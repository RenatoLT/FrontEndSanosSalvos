export function formatChip(chipCode) {
  if (!chipCode) {
    return "Sin registro";
  }
  const cleanChip = chipCode.trim();
  if (!cleanChip || cleanChip.toUpperCase().startsWith("SR-")) {
    return "Sin registro";
  }
  return `Sí (${cleanChip})`;
}
