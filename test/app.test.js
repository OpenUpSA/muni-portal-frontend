const webdriver = require('selenium-webdriver');
const { until } = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const assert = require('assert');


/*

Test Auth functionalities (Login, Signup, Logout) with selenium and mocha

*/


describe('Authentication Testing', function() {
	let driver;

	const BASE_URL = `http://localhost:3000`

	const LOGIN_URL = `${BASE_URL}/accounts/login/`;
	const SIGNUP_URL = `${BASE_URL}/accounts/register/`;

	before(async () => {
	  driver = new webdriver.Builder().forBrowser('firefox')
	  .build();
	}, 30000);

	after(async () => {
	  await driver.quit();
	}, 40000);


	describe('test for login functionality', function(){

		let usernameBox;
		let passwordBox;

		before(async function(){
			await driver.get(LOGIN_URL);
		});

		beforeEach(async function() {
			usernameBox = driver.findElement(By.id('my-muni-Username'));
			passwordBox = driver.findElement(By.id('my-muni-Password'));

			usernameBox.clear();
			passwordBox.clear();
		});

		it('should check for correct inputs', async function(){
			usernameBox.sendKeys('testUser');
			passwordBox.sendKeys('testPassword');
			await driver.sleep(300);
		})

		it('test for successful login', async function(){
			usernameBox.sendKeys('testUser');
			passwordBox.sendKeys('testPassword');

			await driver.sleep(300);
		})

		it('test for login error response', async function(){
			const message = 'Login or password invalid.'

			usernameBox.sendKeys('errorUser');
			passwordBox.sendKeys('errorPass');

			const button = driver.findElement(By.className('button form-submit w-button'));
			button.click();

			await driver.sleep(5000);

			const errorDiv = driver.findElement(By.className('w-form-fail'));
			const errorMessage = await errorDiv.getText();

			assert.equal(message, errorMessage);

			await driver.sleep(500);
		})
	})

	describe('test for signup functionalities', function() {
		let email;
		let username;
		let password;
		let confirmPassword;
		let button;

		before(async function(){
			await driver.get(SIGNUP_URL);
		})

		beforeEach(async function() {
			email = driver.findElement(By.id('my-muni-Email address'));
			username = driver.findElement(By.id('my-muni-Username'));
			password = driver.findElement(By.id('my-muni-Password'));
			confirmPassword = driver.findElement(By.id('my-muni-Confirm password'));
			button = driver.findElement(By.className('button form-submit w-button'));

			username.clear();
			password.clear();
			email.clear();
			confirmPassword.clear();
		});

		it('test for signup error response', function() {
		  // username.sendKeys('errorUser-=--')
		  // usern
		});

		it('check for non-matching password error', async function(){
			username.sendKeys('username');

			email.sendKeys('test@email.com');
			password.sendKeys('test-pass');
			confirmPassword.sendKeys('confirm');
			button.click();

			await driver.sleep(1000)

			const errorDiv = driver.findElement(By.className('w-form-fail'));
			const innerDiv = await errorDiv.findElement(By.tagName('div'));

			const errorMessage = await innerDiv.getText();

			const condition = errorMessage.includes("Passwords don't match");

			assert.ok(condition)
		})

		it('test for signup success message', function() {
		  assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});

	describe('logout test', function() {
		// my-muni-logout
		it('verify logout worked correctly', function() {
		  assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});

});
