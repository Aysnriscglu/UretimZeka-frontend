export type SuggestionRow = any;

const getVal = (r: SuggestionRow, keywords: string[], exclude: string[] = []): string | undefined => {
  if (!r) return undefined;
  
  // 1. exact match on uppercase
  for (const k of Object.keys(r)) {
    const upper = k.trim().toUpperCase();
    if (keywords.includes(upper) && !exclude.some(ex => upper.includes(ex))) {
      return r[k];
    }
  }
  
  // 2. partial match on normalized string
  for (const k of Object.keys(r)) {
    const normalizedKey = k.replace(/\s+/g, '').toLowerCase();
    for (const kw of keywords) {
      if (normalizedKey.includes(kw.toLowerCase().replace(/\s+/g, ''))) {
        if (!exclude.some(ex => normalizedKey.includes(ex.toLowerCase().replace(/\s+/g, '')))) {
          return r[k];
        }
      }
    }
  }
  
  return undefined;
};

export const getSuggestionStatus = (r: SuggestionRow): string => {
  return String(getVal(r, ["STATÜ", "STATU", "DURUM"], ["ESKİ", "ESKI"]) || "Bilinmiyor").trim();
};

export const getGroupedStatus = (r: SuggestionRow): string => {
  const rawStatus = getSuggestionStatus(r).toLowerCase();
  if (rawStatus.includes("hayata geçti") || rawStatus.includes("onaylandı") || rawStatus.includes("tamamlandı")) {
    return "Hayata Geçti";
  }
  if (rawStatus.includes("red") || rawStatus.includes("reddedildi")) {
    return "Reddedildi";
  }
  if (rawStatus.includes("uygulanabilir")) {
    return "Uygulanabilir";
  }
  return "Beklemede / Diğer";
};

export const getSuggestionBenefit = (r: SuggestionRow): string => {
  return String(getVal(r, ["ÖN GÖRÜLEN FAYDA", "FAYDA", "ÖNGÖRÜLEN"], []) || "Diğer").trim();
};

export const getSuggestionAuthor = (r: SuggestionRow): string => {
  return String(getVal(r, ["YAZAR", "İSİM", "ISIM", "KİŞİ", "KISI"], []) || "Bilinmeyen").trim();
};

export const getSuggestionReward = (r: SuggestionRow): string => {
  return String(getVal(r, ["ÖDÜLLENDİRME", "ÖDÜL", "ODUL"], []) || "Yok").trim();
};

export const isImplemented = (r: SuggestionRow): boolean => {
  const status = getSuggestionStatus(r).toLowerCase();
  return status.includes("hayata geçti") || status.includes("onaylandı") || status.includes("tamamlandı");
};

export const isRejected = (r: SuggestionRow): boolean => {
  const status = getSuggestionStatus(r).toLowerCase();
  return status.includes("reddedildi");
};
