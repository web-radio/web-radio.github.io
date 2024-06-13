import type { Station } from 'radiobrowser-api-client';

export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char: string) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function formatLanguage(value: string): string {
  if (!value.includes('-')) return value;
  return value.split('-')[0];
}

export function sortStations(uuids: string[], stations: Station[]) {
  return stations.sort(
    (a: Station, b: Station) =>
      uuids.indexOf(a.stationUUID) - uuids.indexOf(b.stationUUID)
  );
}
