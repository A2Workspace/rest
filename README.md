# Rest

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

### With Vue.js

```js
import rest from '@a2workspace/rest';

const $rest = rest('/api/users');

export default {
  name: 'UsersPage',

  created() {
    $rest.fetchAll({ page: 1 })
      .then((response) => {
        this.users = response.data;
      })
      .finally(() => {
        this.loading = false;
      });
  },

  methods: {
    sortBy(key) {
      $rest.fetchAll((currentParams) => ({
          ...currentParams,
          sort: key,
        }))
        .then((response) => {
          this.users = response.data;
        });
    },
  },
};
```
