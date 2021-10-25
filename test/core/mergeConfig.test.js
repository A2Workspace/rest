import mergeConfig, { mergeAccessible } from '../../src/core/mergeConfig';

describe('mergeConfig()', () => {
  test('基本測試', async () => {
    let params1 = { page: 1 };
    let params2 = { limit: 15 };

    const expectedParams = {
      page: 1,
      limit: 15,
    };

    const target = mergeConfig({ params: params1 }, { params: params2 });

    expect(target).toMatchObject({
      params: expectedParams,
    });
  });
});

describe('mergeAccessible()', () => {
  test('基本測試', async () => {
    let params1 = { page: 1 };
    let params2 = { limit: 15 };

    const expectedParams = {
      page: 1,
      limit: 15,
    };

    const target = mergeAccessible(params1, params2);

    expect(target).toEqual(expectedParams);
  });

  test('無效的參數一', async () => {
    const target = mergeAccessible(null, { limit: 15 });

    expect(target).toEqual({ limit: 15 });
  });

  test('無效的參數二', async () => {
    const target = mergeAccessible({ page: 1 }, null);

    expect(target).toEqual({ page: 1 });
  });
});
