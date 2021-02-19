import { getBaseApiUrl } from '../api';
import { API } from '../api';

import { VALID_USER, VALID_PASSWORD, ACCESS_TOKEN, REFRESH_TOKEN } from './constant';

const BASE_URL = getBaseApiUrl();


function mockLogin(){
  $.mockjax({
    url: `${BASE_URL}/api/accounts/login/`,
    status: 200,
    type: 'post',
    response: function(settings){
      this.responseText = {detail:"Login or password invalid."}

      // Evaluate a success response or a failed response

      const params = new URLSearchParams(settings.data)

      const login = params.get('login');
      const password = params.get('password');

      if (login !== VALID_USER || password !== VALID_PASSWORD){
        this.responseText = {detail:"Login or password invalid."};
        this.status = 400;
        return
      }

      this.responseText = {
        token:{
          access: ACCESS_TOKEN,
          refresh: REFRESH_TOKEN
        }
      }
    }
  });
}


function mockregisterUser(){
  $.mockjax({
    url: `${BASE_URL}/api/accounts/register/`,
    status: 400,
    type: 'post',
    response: function(settings){
      // Evaluate a success response or a failed response.

      const params = new URLSearchParams(settings.data)

      const password = params.get('password');
      const password_confirm = params.get('password_confirm');

      if (password !== password_confirm){
        this.responseText = {password_confirm:["Passwords don't match"],"non_field_errors":[]};
        this.status = 400;
        return
      }

      this.responseText =  "success";
      this.status = 200;
    }
  });
}

export function loadAPI(){
  mockLogin();
  mockregisterUser();
}

