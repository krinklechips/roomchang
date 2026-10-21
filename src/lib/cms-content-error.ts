export class CmsContentError extends Error {
  constructor(collection: string, status?: number) {
    super(`CMS content unavailable for ${collection}${status ? ` (${status})` : ''}.`);
    this.name = 'CmsContentError';
  }
}
