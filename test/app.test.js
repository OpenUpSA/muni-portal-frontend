const webdriver = require('selenium-webdriver');
const { until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/firefox');

const assert = require('assert');

/*

Test Auth functionalities (Login, Signup, Logout) with selenium and mocha

*/


describe('Authentication Testing', function() {
	let driver;

	const BASE_URL = `http://localhost:3000`;
	const LOGIN_URL = `${BASE_URL}/accounts/login/`;
	const SIGNUP_URL = `${BASE_URL}/accounts/register/`;
	const CHANGE_PASSWORD_URL = `${BASE_URL}/account/change-password/`;

	const VALID_USER = 'user';
	const VALID_PASSWORD = 'pass';

	before(async () => {
		let options = new Options()
		driver = new webdriver.Builder().forBrowser('firefox')
		.setFirefoxOptions(options.headless())
		.build();

	}, 30000);

	after(async () => {
	  await driver.quit();
	}, 30000);


	describe('test for login functionality', function(){

		let usernameBox;
		let passwordBox;

		before(async function(){
			await driver.get(LOGIN_URL);
			await driver.sleep(500);
		});

		beforeEach(async function() {
			usernameBox = driver.findElement(By.id('my-muni-Username'));
			passwordBox = driver.findElement(By.id('my-muni-Password'));

			usernameBox.clear();
			passwordBox.clear();
		});

		async function sendData(nm, p1){
			usernameBox.sendKeys(nm);
			passwordBox.sendKeys(p1);

			const button = driver.findElement(By.className('button form-submit w-button'));
			button.click();

			await driver.sleep(1000);
		}

		it('test for login error response', async function(){
			const message = 'Login or password invalid.'

			await sendData('errorUser', 'errorPass')

			const errorDiv = driver.findElement(By.className('w-form-fail'));
			const errorMessage = await errorDiv.getText();

			assert.equal(message, errorMessage);

			await driver.sleep(500);
		})

		it('test for successful login', async function(){

			await sendData(VALID_USER, VALID_PASSWORD);

			const url = await driver.getCurrentUrl();
			const condition = url.endsWith('/services/');

			assert.ok(condition);
		})

	})

	describe('test for signup functionality', function() {
		let email;
		let username;
		let password;
		let confirmPassword;
		let button;

		before(async function(){
			await driver.get(SIGNUP_URL);
			await driver.sleep(500);
		})

		function sendData(nm, em, p1, p2){
			username.sendKeys(nm);
			email.sendKeys(em);
			password.sendKeys(p1);
			confirmPassword.sendKeys(p2);

			button.click();
		}

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

		it('check for non-matching password error', async function(){

			sendData('username', 'test@email.com', 'test-pass', 'incorrect')

			await driver.sleep(2000)

			const errorDiv = driver.findElement(By.className('w-form-fail'));
			const innerDiv = await errorDiv.findElement(By.tagName('div'));
			const errorMessage = await innerDiv.getText();

			const condition = errorMessage.includes("Passwords don't match");

			assert.ok(condition)
		})

		it('test for signup success message', async function() {

			sendData('username', 'test@email.com', 'test-pass', 'test-pass')

			await driver.sleep(1500)

			const successDiv = driver.findElement(By.className('w-form-done'));
			const innerDiv = await successDiv.findElement(By.tagName('div'));
			const successMessage = await innerDiv.getText();

			const condition = successMessage.includes("Thank you! Your submission has been received!");

			assert.ok(condition)
		});
	});

	describe('logout test', function() {
		before(async function(){
			await driver.get(LOGIN_URL);
			const usernameBox = driver.findElement(By.id('my-muni-Username'));
			const passwordBox = driver.findElement(By.id('my-muni-Password'));

			usernameBox.sendKeys(VALID_USER);
			passwordBox.sendKeys(VALID_PASSWORD);
			const button = driver.findElement(By.className('button form-submit w-button'));
			button.click();

			await driver.sleep(2000);
		});

		it('verify logout worked correctly', async function() {
			const button = driver.findElement(By.className('icon nav-menu__icon'));
			button.click();

			await driver.sleep(300);

			const logoutBtn = driver.findElement(By.id('my-muni-logout'));
			logoutBtn.click();

			await driver.sleep(1500);

			const storage = await driver.executeScript('return window.localStorage');
		    const condition = !storage.accessToken && !storage.refreshToken

		    assert.ok(condition);


		});
	});

	describe('change password while logged in', function() {
		let password;
		let oldPassword;
		let confirmPassword;
		let button;

		before(async function(){
			await driver.get(LOGIN_URL);
			const usernameBox = driver.findElement(By.id('my-muni-Username'));
			const passwordBox = driver.findElement(By.id('my-muni-Password'));

			usernameBox.sendKeys(VALID_USER);
			passwordBox.sendKeys(VALID_PASSWORD);
			const button = driver.findElement(By.className('button form-submit w-button'));
			button.click();

			await driver.sleep(2000);

			await driver.get(CHANGE_PASSWORD_URL);
		});

		beforeEach(async function() {
			oldPassword = driver.findElement(By.id('my-muni-old_password'));
			password = driver.findElement(By.id('my-muni-password'));
			confirmPassword = driver.findElement(By.id('my-muni-password_confirm'));
			button = driver.findElement(By.className('button form-submit w-button'))

			oldPassword.clear();
			password.clear();
			confirmPassword.clear();
		});

		async function sendData(ol, pa, cf){
			oldPassword.sendKeys(ol);
			password.sendKeys(pa);
			confirmPassword.sendKeys(cf);

			button.click();

			await driver.sleep(1000);
		}

		it('change password successful', async function(){
			await sendData(VALID_PASSWORD, 'default', 'default')

			const successDiv = driver.findElement(By.className('w-form-done'));
			const successMessage = await successDiv.getText();

			const condition = successMessage.includes("Your password has been changed successfully.");

			assert.ok(condition);
		});

		// it('incorrect old password', async function() {
		// 	await sendData('lospa', 'default', 'default')

		// 	const errorDiv = driver.findElement(By.xpath('/div[@class="w-form-fail change-password-field-error"][1]'));
		// 	const errorMessage = await errorDiv.getText();

		// 	const condition = errorMessage.includes("Old password is not correct");

		// 	assert.ok(condition)
		// });
	});
});
