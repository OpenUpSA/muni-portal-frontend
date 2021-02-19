import { getBaseApiUrl } from './api';
import { API } from './api';

const BASE_URL = getBaseApiUrl();

console.log(BASE_URL);


function mockLogin(){}

function mockRegister(){}

function mockregisterUser(){}
function mockverifyUserRegistration(){}

function mockgetServices(){}


export class MockAPI extends API{
  constructor(props){
    super(props);
  }

  login(...rest){

    // $.mockjax({
    //   url: `${BASE_URL}/api/accounts/login/`,
    //   responseText: {detail:"Login or password invalid."}
    // });
    console.log('Logging in');
    return super.login(...rest);
  }
}

if (process.env.NODE_ENV === 'test'){
  // Call the mockjax to render all mock api endpoints.
}

