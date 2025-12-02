export function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
}

export function minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');

    return `${hh}:${mm}`;
}