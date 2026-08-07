// ---------------------------------------------------------------------------
// ApiFeatures — chainable query builder wrapped around a Mongoose Query.
// Shared by every "list" endpoint (products now; orders/appointments/salons
// etc. reuse the same .search/.sort/.paginate pattern later) so pagination
// and sorting behave identically across the whole API.
// ---------------------------------------------------------------------------
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Full-text search across the Mongo text index (name/description/tags for
  // Product). ProductListing "search" box / global Search.jsx use `?search=`.
  search(fields = []) {
    if (this.queryString.search) {
      if (fields.length) {
        const regex = new RegExp(this.queryString.search, 'i');
        this.query = this.query.find({ $or: fields.map((f) => ({ [f]: regex })) });
      } else {
        this.query = this.query.find({ $text: { $search: this.queryString.search } });
      }
    }
    return this;
  }

  // Generic equality/range filters. `map` translates query-string keys to
  // { field, type } so each controller declares its own filterable fields.
  filter(map = {}) {
    const q = {};
    Object.entries(map).forEach(([param, config]) => {
      const raw = this.queryString[param];
      if (raw === undefined || raw === '') return;

      const { field, type = 'eq' } = config;
      switch (type) {
        case 'in': {
          const values = String(raw).split(',').filter(Boolean);
          if (values.length) q[field] = { ...(q[field] || {}), $in: values };
          break;
        }
        case 'gte':
          q[field] = { ...(q[field] || {}), $gte: Number(raw) };
          break;
        case 'lte':
          q[field] = { ...(q[field] || {}), $lte: Number(raw) };
          break;
        case 'bool':
          q[field] = raw === 'true' || raw === true;
          break;
        default:
          q[field] = raw;
      }
    });
    this.query = this.query.find(q);
    return this;
  }

  // sortMap lets each controller expose friendly sort keys (e.g. ProductListing's
  // 'price-asc' | 'price-desc' | 'rating' | 'discount') mapped to real fields.
  sort(sortMap = {}, defaultSort = '-createdAt') {
    const key = this.queryString.sort;
    const mongoSort = (key && sortMap[key]) || defaultSort;
    this.query = this.query.sort(mongoSort);
    return this;
  }

  paginate(defaultLimit = 12) {
    const page = Math.max(1, parseInt(this.queryString.page, 10) || 1);
    const limit = Math.max(1, parseInt(this.queryString.limit, 10) || defaultLimit);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}

module.exports = ApiFeatures;
