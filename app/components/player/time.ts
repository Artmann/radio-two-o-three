export function formatTime(seconds: number): string {
  const format = (minute: number, second: number): string => [ minute, second ]
    .filter(() => Boolean)
    .map(n => Math.round(n).toString())
    .map(s => s.padStart(2, '0'))
    .join(':');

  const minutes = Math.floor(seconds / 60);

  return format(minutes, seconds - minutes * 60);
}
