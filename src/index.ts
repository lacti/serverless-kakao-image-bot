import { api } from 'api-gateway-rest-handler';

export const keyboard = api(req => {
  return {
    type: 'buttons',
    buttons: ['menu1', 'menu2', 'menu3'],
  };
});
