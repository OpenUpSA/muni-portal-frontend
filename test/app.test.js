const webdriver = require('selenium-webdriver');
const { until, By } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

const assert = require('assert');

const { server: mockServer } = require('../src/js/mocks/server');

const handler = require('serve-handler');
const http = require('http');


/*

Test Auth functionalities (Login, Signup, Logout) with selenium and mocha

*/


describe('Authentication Testing', function () {
    let driver;
    let api_server;
    let static_server;

    const BASE_URL = `http://localhost:3000`;
    const LOGIN_URL = `${BASE_URL}/accounts/login/`;
    const SIGNUP_URL = `${BASE_URL}/accounts/register/`;
    const CHANGE_PASSWORD_URL = `${BASE_URL}/account/change-password/`;

    const VALID_USER = 'user';
    const VALID_PASSWORD = 'pass';

    before(async () => {
        let options = new Options()
        driver = new webdriver.Builder().forBrowser('chrome')
            .setChromeOptions(options.headless())
            .build();

        api_server = mockServer.listen(3004, () => {
            console.log('Mock Server is running')
        })

        static_server = http.createServer((request, response) => {
            return handler(request, response, {
                public: 'dist',
                rewrites: [
                    { "source": "services", "destination": "index.html" },
                    { "source": "accounts/login", "destination": "index.html" },
                    { "source": "accounts/register", "destination": "index.html" },
                    { "source": "account/change-password", "destination": "index.html" }
                ]
            });
        })

        static_server.listen(3000, () => {
            console.log('Running at http://localhost:3000');
        });
    }, 50000);

    after(async () => {
        await driver.quit();
        api_server.close(function () {
            console.log('Mock Server shutdown')
        })

        static_server.close(function () { console.log('Shutting down static server') })
    }, 50000);


    describe('test for login functionality', function () {

        before(async function () {
            await driver.get(LOGIN_URL);
            let el = await driver.findElement(By.id('my-muni-Username'));
            await driver.wait(until.elementIsVisible(el), 3000);
        });

        beforeEach(async function () {
            const [username, password] = getElements()
            username.clear();
            password.clear();
        });

        function getElements(){
            const usernameBox = driver.findElement(By.id('my-muni-Username'));
            const passwordBox = driver.findElement(By.id('my-muni-Password'));
            return [usernameBox, passwordBox]
        }

        async function sendData(user, pass) {
            const [username, password] = getElements()

            username.sendKeys(user);
            password.sendKeys(pass);

            const button = driver.findElement(By.css('form.form__inner button.form-submit.w-button'));
            button.click();

            await driver.sleep(1000);
        }

        it('test for login error response', async function () {
            const message = 'Login or password invalid.'

            await sendData('errorUser', 'errorPass')

            const errorDiv = driver.findElement(By.className('w-form-fail'));
            const errorMessage = await errorDiv.getText();

            assert.equal(message, errorMessage);
        })

        it('test for successful login', async function () {

            await sendData(VALID_USER, VALID_PASSWORD);

            let button;
            button = driver.findElement(By.className('icon nav-menu__icon'));

            await driver.wait(until.elementIsVisible(button), 3000)
            button.click();

            const logoutBtn = driver.findElement(By.id('my-muni-logout'));
            await driver.wait(until.elementIsVisible(logoutBtn), 3000);

            const logoutText = await logoutBtn.getText();

            assert.ok(logoutText === 'Logout');
        })

    })

    describe('test for signup functionality', function () {

        before(async function () {
            await driver.get(SIGNUP_URL);
            let el = await driver.findElement(By.id('my-muni-Email address'));
            await driver.wait(until.elementIsVisible(el), 500);

        })

        function sendData(user, user_email, password1, password2) {
            const [email, username, password, confirmPassword] = getInputs();
            const button = driver.findElement(By.className('button form-submit w-button'));

            username.sendKeys(user);
            email.sendKeys(user_email);
            password.sendKeys(password1);
            confirmPassword.sendKeys(password2);

            button.click();
        }

        function getInputs(){
            const email = driver.findElement(By.id('my-muni-Email address'));
            const username = driver.findElement(By.id('my-muni-Username'));
            const password = driver.findElement(By.id('my-muni-Password'));
            const confirmPassword = driver.findElement(By.id('my-muni-Confirm password'));

            return [email, username, password, confirmPassword]
        }

        beforeEach(async function () {
            const [email, username, password, confirmPassword] = getInputs();

            username.clear();
            password.clear();
            email.clear();
            confirmPassword.clear();
        });

        it('check for non-matching password error', async function () {

            sendData('username', 'test@email.com', 'test-pass', 'incorrect')

            const errorDiv = driver.findElement(By.className('w-form-fail'));

            await driver.wait(until.elementIsVisible(errorDiv), 3000)

            const innerDiv = await errorDiv.findElement(By.tagName('div'));
            const errorMessage = await innerDiv.getText();

            const condition = errorMessage.includes("Passwords don't match");

            assert.ok(condition)
        })

        it('test for signup success message', async function () {

            sendData('username', 'test@email.com', 'test-pass', 'test-pass')

            const successDiv = driver.findElement(By.className('w-form-done'));

            await driver.wait(until.elementIsVisible(successDiv), 3000)

            const innerDiv = await successDiv.findElement(By.tagName('div'));
            const successMessage = await innerDiv.getText();

            const condition = successMessage.includes("Thank you! Your submission has been received!");

            assert.ok(condition)
        });
    });

    describe('logout test', function () {
        before(async function () {
            await driver.get(LOGIN_URL);
            let el = await driver.findElement(By.id('my-muni-Username'));
            await driver.wait(until.elementIsVisible(el), 1000);

            const usernameBox = driver.findElement(By.id('my-muni-Username'));
            const passwordBox = driver.findElement(By.id('my-muni-Password'));

            usernameBox.sendKeys(VALID_USER);
            passwordBox.sendKeys(VALID_PASSWORD);
            const button = driver.findElement(By.className('button form-submit w-button'));
            button.click();
        });

        it('verify logout worked correctly', async function () {

            const button = driver.findElement(By.className('icon nav-menu__icon'));
            button.click();

            const logoutBtn = driver.findElement(By.id('my-muni-logout'));
            logoutBtn.click();

            await driver.sleep(1500);

            const storage = await driver.executeScript('return window.localStorage');
            const accessToken = storage.accessToken;
            const refreshToken = storage.refreshToken;
            const condition = accessToken && accessToken.length > 0 && refreshToken && refreshToken.length > 0

            assert.ok(condition);


        });
    });

    describe('change password while logged in', function () {

        before(async function () {
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

        beforeEach(async function () {
            const [oldPassword, password, confirmPassword] = getInputs();

            oldPassword.clear();
            password.clear();
            confirmPassword.clear();
        });

        function getInputs(){
            const oldPassword = driver.findElement(By.id('my-muni-old_password'));
            const password = driver.findElement(By.id('my-muni-password'));
            const confirmPassword = driver.findElement(By.id('my-muni-password_confirm'));
            return [oldPassword, password, confirmPassword]
        }

        async function sendData(old_password, new_password, confirm_password) {
            const [oldPassword, password, confirmPassword] = getInputs();

            oldPassword.sendKeys(old_password);
            password.sendKeys(new_password);
            confirmPassword.sendKeys(confirm_password);

            const button = driver.findElement(By.className('button form-submit w-button'))
            button.click();

            await driver.sleep(1000);
        }

        it('change password successful', async function () {
            await sendData(VALID_PASSWORD, 'default', 'default')

            const successDiv = driver.findElement(By.className('w-form-done'));
            const successMessage = await successDiv.getText();

            const condition = successMessage.includes("Your password has been changed successfully.");

            await driver.sleep(10000)

            assert.ok(condition);
        });
    });
});
