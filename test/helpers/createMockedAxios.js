import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export default function () {
  return new MockAdapter(axios);
}
