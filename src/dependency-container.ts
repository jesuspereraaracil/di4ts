type Tag = string | symbol;

interface Container {
  set<T>(symbol: symbol, dep: T, tags?: Tag[]): void;
  get<T>(symbol: symbol): T | undefined;
  getByTag<T>(tag: Tag): T[];
  hasTag(tag: Tag): boolean;
  getTagsFor(symbol: symbol): Tag[];
}

const createContainer = (): Container => {
  const _dependencies = new Map<
    symbol,
    { instance: unknown; tags: Set<Tag> }
  >();

  const processTags = (tags: Tag[]): Set<Tag> => new Set(tags);

  const set = <T>(symbol: symbol, dep: T, tags: Tag[] = []): void => {
    const tagSet = processTags(tags);
    _dependencies.set(symbol, { instance: dep, tags: tagSet });
  };

  const get = <T>(symbol: symbol): T | undefined => {
    const entry = _dependencies.get(symbol);
    return entry ? (entry.instance as T) : undefined;
  };

  const getByTag = <T>(tag: Tag): T[] => {
    const result: T[] = [];
    for (const [, entry] of _dependencies) {
      if (entry.tags.has(tag)) {
        result.push(entry.instance as T);
      }
    }
    return result;
  };

  const hasTag = (tag: Tag): boolean => {
    for (const entry of _dependencies.values()) {
      if (entry.tags.has(tag)) {
        return true;
      }
    }
    return false;
  };

  const getTagsFor = (symbol: symbol): Tag[] => {
    const entry = _dependencies.get(symbol);
    return entry ? Array.from(entry.tags) : [];
  };

  return { set, get, getByTag, hasTag, getTagsFor };
};

export const DependencyContainer = createContainer();
