import axios from 'axios';

let defaults = {
  fetchAll: {
    method: 'get',
    params: {},
  },

  fetch: {
    method: 'get',
    params: {},
  },

  create: {
    method: 'post',
    data: {},
  },

  update: {
    method: 'put',
    data: {},
  },

  delete: {
    method: 'delete',
    data: {},
  },
};

export default defaults;
