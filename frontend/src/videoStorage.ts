export interface StoredScanVideo {
  id: string;
  name: string;
  createdAt: string;
}

interface StoredScanVideoRecord extends StoredScanVideo {
  blob: Blob;
}

const DATABASE_NAME = 'namma-space-media';
const STORE_NAME = 'recorded-videos';
const DATABASE_VERSION = 1;

function openVideoDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveRecordedVideo(blob: Blob): Promise<StoredScanVideo> {
  const metadata: StoredScanVideo = {
    id: `scan-${Date.now()}`,
    name: `namma-space-scan-${Date.now()}.webm`,
    createdAt: new Date().toISOString(),
  };
  const database = await openVideoDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put({ ...metadata, blob } satisfies StoredScanVideoRecord);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
  database.close();
  return metadata;
}

export async function listRecordedVideos(): Promise<StoredScanVideo[]> {
  const database = await openVideoDatabase();
  const records = await new Promise<StoredScanVideoRecord[]>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StoredScanVideoRecord[]);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return records
    .map(({ id, name, createdAt }) => ({ id, name, createdAt }))
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));
}

export async function getRecordedVideo(id: string): Promise<Blob | null> {
  const database = await openVideoDatabase();
  const record = await new Promise<StoredScanVideoRecord | undefined>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve(request.result as StoredScanVideoRecord | undefined);
    request.onerror = () => reject(request.error);
  });
  database.close();
  return record?.blob ?? null;
}
