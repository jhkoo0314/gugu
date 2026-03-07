import type { StudyRecord } from "@/types/quiz";

const STORAGE_KEY = "gugu-study-records";
const MAX_STUDY_RECORDS = 20;

function isStudyRecordArray(value: unknown): value is StudyRecord[] {
  return Array.isArray(value);
}

export function loadStudyRecords(): StudyRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (storedValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return isStudyRecordArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function saveStudyRecord(record: StudyRecord): StudyRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const records = loadStudyRecords();
    const nextRecords = [record, ...records].slice(0, MAX_STUDY_RECORDS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecords));

    return nextRecords;
  } catch {
    return loadStudyRecords();
  }
}

export function clearStudyRecords(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
