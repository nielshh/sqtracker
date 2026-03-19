const cleanShowName = (name) =>
  name
    .trim()
    .replace(/[.\-\s]+$/, "")
    .replaceAll(".", " ");

export const parseTvShow = (name) => {
  // 1. Episode: S01E01 or S1E1
  const episodeMatch = name.match(/^(.*)[. ]S(\d{1,2})E(\d{1,2})/i);
  if (episodeMatch) {
    return {
      showName: cleanShowName(episodeMatch[1]),
      season: parseInt(episodeMatch[2]),
      episode: parseInt(episodeMatch[3]),
      isSeasonPack: false,
    };
  }

  // 2. Season pack: S01 or S1
  const seasonMatch = name.match(/^(.*)[. ]S(\d{1,2})(?![E\d])/i);
  if (seasonMatch) {
    return {
      showName: cleanShowName(seasonMatch[1]),
      season: parseInt(seasonMatch[2]),
      isSeasonPack: true,
    };
  }

  // 3. Season pack: Season 1 or Season 01
  const seasonFullMatch = name.match(/^(.*)[. ]Season[ .](\d{1,2})/i);
  if (seasonFullMatch) {
    return {
      showName: cleanShowName(seasonFullMatch[1]),
      season: parseInt(seasonFullMatch[2]),
      isSeasonPack: true,
    };
  }

  return null;
};
