export const deduplicate = <T>(
  items: T[],
  deduplicationProperty: string,
): T[] =>
  items.filter(
    (conference, index) =>
      index ===
      items.findIndex(
        obj => obj[deduplicationProperty] === conference[deduplicationProperty],
      ),
  );
