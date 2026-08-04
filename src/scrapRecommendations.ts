export const scrapRecommendations: Record<
  string,
  {
    reasons: string[];
    checks: string[];
  }
> = {
  "006": {
    reasons: [
      "Kaynak akımı düşük olabilir.",
      "Elektrot aşınmış olabilir.",
      "Parça kaynak öncesi tam oturmamış olabilir.",
    ],
    checks: [
      "Kaynak parametrelerini kontrol edin.",
      "Elektrot yüzeyini temizleyin.",
      "Fikstür sıkılığını kontrol edin.",
    ],
  },

  "098": {
    reasons: [
      "Kaynak bölgesi kirli olabilir.",
      "Parça yanlış konumlanmış olabilir.",
    ],
    checks: [
      "Parçanın konumunu doğrulayın.",
      "Yüzey temizliğini kontrol edin.",
    ],
  },

  "100": {
    reasons: [
      "Kesme bıçağı aşınmış olabilir.",
      "Malzeme kalınlığı değişmiş olabilir.",
    ],
    checks: [
      "Kesici takımı kontrol edin.",
      "Malzeme ölçülerini doğrulayın.",
    ],
  },

  "123": {
    reasons: [
      "Kaynak diski aşırı ısınmış olabilir.",
      "Soğutma yetersiz olabilir.",
    ],
    checks: [
      "Soğutma sistemini kontrol edin.",
      "Kaynak süresini gözden geçirin.",
    ],
  },
};