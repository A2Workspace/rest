# Rest

```js
const users = rest('/api/users');

async users.fetchAll()
  .catchStatusCode(403, (error) => this.handleForbidden(error))
  .catch((error) => this.handleError(error));
```

## 目錄

- [安裝](#安裝)
- [如何使用](#如何使用)
  - [Rest.fetchAll(query)](#Rest.fetchAll(query))
  - [Rest.create(data)](#Rest.create(data))
  - [Rest.fetch(id, params)](#Rest.fetch(id,-params))
  - [Rest.update(id, data)](#Rest.update(id,-data))
  - [Rest.delete(id, params)](#Rest.update(id,-params))
  
- [RestPromise](#RestPromise)
  - [RestPromise.catchValidationError(handler)](RestPromise.catchValidationError(handler))
  - [RestPromise.catchStatusCode(code[], handler)](RestPromise.catchStatusCode(code[],-handler))
  - [RestPromise.catchAxiosError(handler)](RestPromise.catchAxiosError(handler))

- [一個簡單的 Vue 範例](#一個簡單的-Vue-範例)

---

## 安裝

```bash
npm install -s git+https://github.com/A2Workspace/rest.git
```

## 如何使用

```js
import rest from '@a2workspace/rest';

const users = rest('/api/users');

users.fetchAll({ limit: 10 }).then((response) => {
  console.log(response.data);
});
```

### Rest.fetchAll(query)

```js
const users = rest('/api/users');

users
  .fetchAll({
    page: 1,
    limit: 10,
  })
  .then((response) => {
    console.log(response.data);
  });
```

### Rest.create(data)

```js
const users = rest('/api/users');

users
  .create({
    username: 'John',
    password: 'secret',
  })
  .then((response) => {
    this.$message.success('新增完成');
  });
```

### Rest.fetch(id, params)

```js
const users = rest('/api/users');

users.fetch(12345).then((response) => {
  this.user = response.data;
});
```

### Rest.update(id, data)

```js
const users = rest('/api/users');

users
  .update(12345, {
    username: 'Wick',
  })
  .then((response) => {
    this.$message.success('更新完成');
  });
```

### Rest.delete(id, params)

```js
const users = rest('/api/users');

users.delete(12345).then((response) => {
  this.$message.info('已成功刪除');
});
```

## RestPromise

### RestPromise.catchValidationError(handler)

```js
const users = rest('/api/users');

users
  .create(this.data)
  .catchValidationError((context) => {
    this.$message.error('缺少必要欄位資料');

    console.error(context.message);
    this.errorMessage = context.first();
    this.errors = context.errors;
  })
  .catch((error) => {
    console.error(error);
  });
```

### RestPromise.catchStatusCode(code[], handler)

```js
const users = rest('/api/users');

users
  .fetchAll()
  .catchStatusCode([401, 403], (axiosError) => {
    this.$message.error('您沒有權限訪問這個頁面');
  })
  .catchStatusCode(500, (axiosError) => {
    this.$message.error('伺服器錯誤');
  })
  .catch((error) => {
    console.error(error);
  });
```

### RestPromise.catchAxiosError(handler)

```js
const users = rest('/api/users');

users
  .fetchAll()
  .catchAxiosError((axiosError) => {
    this.$message.error('請求失敗');
  })
  .catch((error) => {
    console.error(error);
  });
```

---

## 一個簡單的 Vue 範例

```js
import rest from '@a2workspace/rest';

export default {
  name: 'UsersPage',

  data() {
    return {
      loading: true,
      users: [],
      form: {},
      errors: {},
    };
  },

  methods: {
    fetch(page) {
      this.loading = true;

      this.$rest
        .fetchAll({ page })
        .then((response) => {
          this.users = response.data.users;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    show(id) {
      this.loading = true;

      this.$rest
        .fetch(id)
        .then((response) => {
          this.$emit('openDialog', response.data);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    create() {
      this.loading = true;

      this.$rest
        .create(this.form)
        .then((response) => {
          this.$message.success('已成功新增');
          this.fetch();
        })
        .catchValidationError((context) => {
          this.errors = context.errors;
          this.$message.error(context.first());
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },

  created() {
    this.$rest = rest('/api/users');

    this.fetch();
  },
};
```
