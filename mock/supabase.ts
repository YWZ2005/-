import {
  MOCK_USER,
  MOCK_THROWER_USER,
  MOCK_THIRD_USER,
  MOCK_BOTTLES,
  MOCK_CONVERSATION,
  MOCK_MESSAGES,
  MOCK_OCEAN_ASSETS,
} from './data';

interface MockUser {
  id: string;
  email?: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
  created_at: string;
}

const mockAuthUser: MockUser = {
  id: MOCK_USER.id,
  app_metadata: {},
  user_metadata: {},
  created_at: MOCK_USER.created_at,
};

export const mockAuth = {
  getUser: async () => ({ data: { user: mockAuthUser }, error: null }),
  getSession: async () => ({ data: { session: null }, error: null }),
  signInWithPassword: async () => ({ data: { user: mockAuthUser, session: null }, error: null }),
  signUp: async () => ({ data: { user: mockAuthUser, session: null }, error: null }),
  signOut: async () => ({ error: null }),
  updateUser: async () => ({ data: { user: mockAuthUser }, error: null }),
  onAuthStateChange: () => ({
    data: { subscription: { unsubscribe: () => {} } },
  }),
};

type FilterOperator = 'eq' | 'neq' | 'gte' | 'gt' | 'lte' | 'lt' | 'like' | 'ilike' | 'is' | 'in' | 'contains';

interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: unknown;
}

interface OrderConfig {
  column: string;
  ascending: boolean;
}

interface SelectOptions {
  count?: 'exact' | 'planned' | 'estimated';
  head?: boolean;
}

class MockQueryBuilder {
  private table: string;
  private store: Record<string, unknown>[];
  private filters: FilterCondition[] = [];
  private orderConfig: OrderConfig | null = null;
  private limitCount: number | null = null;
  private selectColumns: string = '*';
  private selectOptions: SelectOptions = {};
  private orFilters: string[] = [];

  constructor(table: string, store: Record<string, unknown>[]) {
    this.table = table;
    this.store = [...store];
  }

  select(columns = '*', options: SelectOptions = {}) {
    this.selectColumns = columns;
    this.selectOptions = options;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  neq(column: string, value: unknown) {
    this.filters.push({ column, operator: 'neq', value });
    return this;
  }

  gte(column: string, value: unknown) {
    this.filters.push({ column, operator: 'gte', value });
    return this;
  }

  gt(column: string, value: unknown) {
    this.filters.push({ column, operator: 'gt', value });
    return this;
  }

  lte(column: string, value: unknown) {
    this.filters.push({ column, operator: 'lte', value });
    return this;
  }

  lt(column: string, value: unknown) {
    this.filters.push({ column, operator: 'lt', value });
    return this;
  }

  order(column: string, options: { ascending?: boolean } = {}) {
    this.orderConfig = {
      column,
      ascending: options.ascending ?? true,
    };
    return this;
  }

  limit(n: number) {
    this.limitCount = n;
    return this;
  }

  or(filter: string) {
    this.orFilters.push(filter);
    return this;
  }

  private applyFilters(data: Record<string, unknown>[]): Record<string, unknown>[] {
    return data.filter((item) => {
      for (const filter of this.filters) {
        if (!this.matchFilter(item, filter)) {
          return false;
        }
      }
      if (this.orFilters.length > 0) {
        const orMatch = this.orFilters.some((orFilter) => this.matchOrFilter(item, orFilter));
        if (!orMatch) return false;
      }
      return true;
    });
  }

  private matchFilter(item: Record<string, unknown>, filter: FilterCondition): boolean {
    const { column, operator, value } = filter;

    if (column.includes('.')) {
      return true;
    }

    const itemValue = item[column];

    switch (operator) {
      case 'eq':
        return itemValue === value;
      case 'neq':
        return itemValue !== value;
      case 'gte':
        if (typeof itemValue === 'number' && typeof value === 'number') {
          return itemValue >= value;
        }
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue >= value;
        }
        return true;
      case 'gt':
        if (typeof itemValue === 'number' && typeof value === 'number') {
          return itemValue > value;
        }
        return true;
      case 'lte':
        if (typeof itemValue === 'number' && typeof value === 'number') {
          return itemValue <= value;
        }
        return true;
      case 'lt':
        if (typeof itemValue === 'number' && typeof value === 'number') {
          return itemValue < value;
        }
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue < value;
        }
        return true;
      case 'is':
        return itemValue === value;
      default:
        return true;
    }
  }

  private matchOrFilter(item: Record<string, unknown>, orFilter: string): boolean {
    const conditions = orFilter.split(',');
    return conditions.some((cond) => {
      const trimmed = cond.trim();
      if (trimmed.includes('.is.null')) {
        return true;
      }
      if (trimmed.includes('.gt.')) {
        return true;
      }
      if (trimmed.includes('.gte.')) {
        return true;
      }
      if (trimmed.includes('.lt.')) {
        return true;
      }
      return true;
    });
  }

  private applyOrder(data: Record<string, unknown>[]): Record<string, unknown>[] {
    if (!this.orderConfig) return data;

    const { column, ascending } = this.orderConfig;

    return [...data].sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return ascending ? -1 : 1;
      if (bVal == null) return ascending ? 1 : -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return ascending ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });
  }

  private applyLimit(data: Record<string, unknown>[]): Record<string, unknown>[] {
    if (this.limitCount == null) return data;
    return data.slice(0, this.limitCount);
  }

  private enrichWithRelations(data: Record<string, unknown>[]): Record<string, unknown>[] {
    if (this.table === 'bottles' && this.selectColumns.includes('thrower')) {
      return data.map((item) => {
        const throwerId = item.thrower_id;
        let throwerData: Record<string, unknown> = { credit_score: 80 };

        if (throwerId === MOCK_USER.id) {
          throwerData = { credit_score: MOCK_USER.credit_score };
        } else if (throwerId === MOCK_THROWER_USER.id) {
          throwerData = { credit_score: MOCK_THROWER_USER.credit_score };
        } else if (throwerId === MOCK_THIRD_USER.id) {
          throwerData = { credit_score: MOCK_THIRD_USER.credit_score };
        }

        return { ...item, thrower: throwerData };
      });
    }
    return data;
  }

  private async execute(): Promise<{ data: Record<string, unknown>[] | null; count: number | null; error: { message: string } | null }> {
    let filtered = this.applyFilters(this.store);
    filtered = this.enrichWithRelations(filtered);
    filtered = this.applyOrder(filtered);
    filtered = this.applyLimit(filtered);

    const count = this.selectOptions.count ? filtered.length : null;

    if (this.selectOptions.head) {
      return { data: null, count, error: null };
    }

    return { data: filtered, count, error: null };
  }

  async then<TResult1 = { data: Record<string, unknown>[] | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: Record<string, unknown>[] | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const result = await this.execute();
    const simpleResult = { data: result.data, error: result.error };
    if (onfulfilled) {
      return Promise.resolve(onfulfilled(simpleResult));
    }
    return Promise.resolve(simpleResult) as unknown as Promise<TResult1 | TResult2>;
  }

  async single() {
    const result = await this.execute();
    const data = result.data && result.data.length > 0 ? result.data[0] : null;
    return {
      data,
      error: data ? null : { message: 'No rows found' },
      count: result.count,
    };
  }

  async maybeSingle() {
    const result = await this.execute();
    const data = result.data && result.data.length > 0 ? result.data[0] : null;
    return { data, error: null, count: result.count };
  }
}

class MockInsertBuilder {
  private table: string;
  private data: unknown;
  private queryBuilder: MockQueryBuilder | null = null;
  private onConflictColumn: string | null = null;
  private ignoreConflict = false;

  constructor(table: string, data: unknown) {
    this.table = table;
    this.data = data;
  }

  select(columns = '*') {
    const store = getTableStore(this.table);
    const items = Array.isArray(this.data) ? this.data : [this.data];
    const inserted = items.map((item, index) => ({
      ...(item as Record<string, unknown>),
      id: `mock-${this.table}-${Date.now()}-${index}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    this.queryBuilder = new MockQueryBuilder(this.table, [...store, ...inserted]);
    this.queryBuilder.select(columns);
    return this.queryBuilder;
  }

  onConflict(column: string) {
    this.onConflictColumn = column;
    return this;
  }

  ignore() {
    this.ignoreConflict = true;
    return this;
  }

  async then<TResult1 = { data: unknown; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const result = { data: null, error: null };
    if (onfulfilled) {
      return Promise.resolve(onfulfilled(result));
    }
    return Promise.resolve(result) as unknown as Promise<TResult1 | TResult2>;
  }
}

class MockUpdateBuilder {
  private table: string;
  private updates: Record<string, unknown>;
  private filters: FilterCondition[] = [];
  private queryBuilder: MockQueryBuilder | null = null;

  constructor(table: string, updates: Record<string, unknown>) {
    this.table = table;
    this.updates = updates;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, operator: 'eq', value });
    return this;
  }

  gte(column: string, value: unknown) {
    this.filters.push({ column, operator: 'gte', value });
    return this;
  }

  lt(column: string, value: unknown) {
    this.filters.push({ column, operator: 'lt', value });
    return this;
  }

  select(columns = '*') {
    const store = getTableStore(this.table);
    const updatedStore = store.map((item) => {
      const matches = this.filters.every((f) => {
        const itemVal = item[f.column];
        if (f.operator === 'eq') return itemVal === f.value;
        if (f.operator === 'gte') {
          if (typeof itemVal === 'number' && typeof f.value === 'number') return itemVal >= f.value;
          return true;
        }
        return true;
      });
      if (matches) {
        return { ...item, ...this.updates };
      }
      return item;
    });
    this.queryBuilder = new MockQueryBuilder(this.table, updatedStore);
    for (const f of this.filters) {
      (this.queryBuilder as unknown as { eq: (c: string, v: unknown) => unknown }).eq(f.column, f.value);
    }
    this.queryBuilder.select(columns);
    return this.queryBuilder;
  }

  async then<TResult1 = { data: unknown; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const result = { data: null, error: null, status: 204, statusText: 'No Content' };
    if (onfulfilled) {
      return Promise.resolve(onfulfilled(result));
    }
    return Promise.resolve(result) as unknown as Promise<TResult1 | TResult2>;
  }
}

function getTableStore(table: string): Record<string, unknown>[] {
  switch (table) {
    case 'users':
      return [
        MOCK_USER as unknown as Record<string, unknown>,
        MOCK_THROWER_USER as unknown as Record<string, unknown>,
        MOCK_THIRD_USER as unknown as Record<string, unknown>,
      ];
    case 'bottles':
      return MOCK_BOTTLES as unknown as Record<string, unknown>[];
    case 'conversations':
      return [MOCK_CONVERSATION as unknown as Record<string, unknown>];
    case 'messages':
      return MOCK_MESSAGES as unknown as Record<string, unknown>[];
    case 'ocean_assets':
      return MOCK_OCEAN_ASSETS as unknown as Record<string, unknown>[];
    default:
      return [];
  }
}

function createMockTable(table: string) {
  const store = getTableStore(table);

  return {
    select: (columns?: string, options?: SelectOptions) => {
      const builder = new MockQueryBuilder(table, store);
      return builder.select(columns, options);
    },
    insert: (data: unknown) => {
      return new MockInsertBuilder(table, data);
    },
    update: (updates: Record<string, unknown>) => {
      return new MockUpdateBuilder(table, updates);
    },
    delete: () => ({
      eq: () => ({ error: null }),
      error: null,
    }),
    upsert: () => ({
      select: () => ({ data: null, error: null }),
      error: null,
    }),
  };
}

export function createMockSupabase() {
  return {
    auth: mockAuth,
    from: (table: string) => createMockTable(table),
    channel: (name: string) => ({
      name,
      on: () => ({
        subscribe: () => ({ status: 'SUBSCRIBED' }),
      }),
      subscribe: () => ({ status: 'SUBSCRIBED' }),
    }),
    removeChannel: () => Promise.resolve(),
    removeAllChannels: () => Promise.resolve(),
  };
}
