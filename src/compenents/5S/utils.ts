export interface AttendanceRow {
  [key: string]: any;
}

// Check if a value is a positive indicator
const isPositive = (val: any) => {
  if (val === undefined || val === null) return false;
  const str = String(val).trim().toLocaleLowerCase("tr-TR");
  const positiveWords = [
    "evet", "1", "var", "katıldı", "katildi", "geldi", "tam", "mevcut", "burada", "ok",
    "✔", "✓", "✅", "☑️", "✔️", "+", "x"
  ];
  return positiveWords.includes(str) || positiveWords.some(w => w.length > 3 && str.includes(w));
};

export const getAbsentDays = (r: AttendanceRow): number => {
  const keys = Object.keys(r);
  
  // Directly look for "KATILIM OLMAYAN GÜN SAYISI" but exclude "MAZERETLİ"
  const absentKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return (k.includes("KATILIMOLMAYAN") || k.includes("DEVAMSIZ")) && !k.includes("MAZERET");
  });
  
  if (absentKey) {
    const val = r[absentKey];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      return Number(val) || 0;
    }
  }
  return 0; // Default if not found
};

export const isAttended = (r: AttendanceRow) => {
  const keys = Object.keys(r);
  
  // 1. Check DEVAMSIZ / KATILIM OLMAYAN GÜN SAYISI first
  const absentKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return (k.includes("KATILIMOLMAYAN") || k.includes("DEVAMSIZ")) && !k.includes("MAZERET");
  });
  
  if (absentKey && r[absentKey] !== undefined && String(r[absentKey]).trim() !== "") {
    return Number(r[absentKey]) === 0;
  }

  // 2. Fallback to KATILIM column
  const katilimKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return (k.includes("KATILIM") || k === "KATIL" || k.includes("DURUM")) && 
    !k.includes("GEÇ") && !k.includes("GEC") && !k.includes("MAZERET") && !k.includes("OLMAYAN");
  });
  
  if (katilimKey) {
    return isPositive(r[katilimKey]);
  }
  
  return false;
};

export const isLate = (r: AttendanceRow) => {
  const keys = Object.keys(r);
  const lateKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return k.includes("GEÇKATIL") || k.includes("GECKATIL") || k.includes("GECİKME") || k.includes("GECIKME");
  });
  
  if (lateKey) {
    const str = String(r[lateKey] || "").trim().toLocaleLowerCase("tr-TR");
    return isPositive(str) || str.includes("gec") || str.includes("geç");
  }
  return false;
};

export const isExcused = (r: AttendanceRow) => {
  const keys = Object.keys(r);
  // Look for MAZERETLİ Mİ? or similar, but NOT SAYISI/GÜN (which are counts)
  const excusedKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return (k.includes("MAZERET") || k.includes("İZİN") || k.includes("IZIN")) && 
    !k.includes("SAYISI") && !k.includes("GÜN") && !k.includes("GUN") && !k.includes("MAZERETSİZ");
  });
  
  if (excusedKey) {
    const str = String(r[excusedKey] || "").trim().toLocaleLowerCase("tr-TR");
    return isPositive(str) || str.includes("izin") || str.includes("mazeret");
  }
  return false;
};

export const getHafta = (r: AttendanceRow): number | null => {
  const keys = Object.keys(r);
  const haftaKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return k.includes("HAFTA") || k.includes("WEEK");
  });
  
  if (haftaKey) {
    const match = String(r[haftaKey] || "").match(/\d+/);
    if (match) return parseInt(match[0], 10);
  }
  return null;
};

export const getBolum = (r: AttendanceRow): string => {
  const keys = Object.keys(r);
  const bolumKey = keys.find(key => {
    const k = key.toUpperCase().replace(/\s+/g, '');
    return k.includes("BÖLÜM") || k.includes("BOLUM") || k.includes("HAT") || k.includes("ALAN");
  });
  return bolumKey ? String(r[bolumKey] || "Bilinmiyor").trim() : "Bilinmiyor";
};
