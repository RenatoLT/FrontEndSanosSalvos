export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length || a.length === 0) {
    return 0;
  }
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function getMetadataSimilarity(r1, r2) {
  if (!r1 || !r2) return 0.5;

  let score = 0;
  let maxScore = 0;

  // Especie
  if (r1.especie && r2.especie) {
    maxScore += 3;
    if (r1.especie.toUpperCase() === r2.especie.toUpperCase()) {
      score += 3;
    }
  }

  // Color
  if (r1.color && r2.color) {
    maxScore += 2;
    const c1 = r1.color.toLowerCase();
    const c2 = r2.color.toLowerCase();
    if (c1 === c2) {
      score += 2;
    } else {
      const words1 = c1.split(/\s+/);
      const words2 = c2.split(/\s+/);
      const matches = words1.filter((w) => words2.includes(w));
      if (matches.length > 0) {
        score += 1.5;
      }
    }
  }

  // Raza
  const raza1 = r1.raza || r1.razaMascota;
  const raza2 = r2.raza || r2.razaMascota;
  if (raza1 && raza2) {
    maxScore += 2;
    if (raza1.toLowerCase() === raza2.toLowerCase()) {
      score += 2;
    }
  }

  // Tamaño
  const tamano1 = r1.tamano || r1.tamaño;
  const tamano2 = r2.tamano || r2.tamaño;
  if (tamano1 && tamano2) {
    maxScore += 1;
    if (tamano1.toUpperCase() === tamano2.toUpperCase()) {
      score += 1;
    }
  }

  return maxScore > 0 ? score / maxScore : 0.5;
}
