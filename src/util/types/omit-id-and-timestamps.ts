export type OmitIdAndTimestamps<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
