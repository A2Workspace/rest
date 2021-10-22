import axios from 'axios';

let defaults = {
  axios,

  fetchAll: {
    method: 'get',
    params: {},
  },

  create: {
    method: 'post',
    data: {},
  },

  fetch: {
    method: 'get',
    params: {},
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
