export function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function toTimeLabel(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function buildSlots(startTime: string, endTime: string, slotMinutes: number) {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const slots: string[] = [];

  for (let cursor = start; cursor + slotMinutes <= end; cursor += slotMinutes) {
    slots.push(`${toTimeLabel(cursor)} - ${toTimeLabel(cursor + slotMinutes)}`);
  }

  return slots;
}

export function slotBounds(startTime: string, slot: number, slotMinutes: number, durationSlots = 1) {
  const start = toMinutes(startTime) + slot * slotMinutes;
  return {
    startTime: toTimeLabel(start),
    endTime: toTimeLabel(start + slotMinutes * durationSlots)
  };
}
