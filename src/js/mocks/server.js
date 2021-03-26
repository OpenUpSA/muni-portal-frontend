const jsonServer = require('json-server')
const fs = require('fs');
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const VALID_USER = 'user';
const VALID_PASSWORD = 'pass';
const ACCESS_TOKEN = 'sdfjknwjnfwjnofonwewwf';
const REFRESH_TOKEN = 'sdfjknwjnfwjnofonwewwf';


server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/api/accounts/login', (req, res) => {
	const response = {detail: "Login or password invalid."}

	const login = req.body.login;
	const password = req.body.password;

	if (login !== VALID_USER || password !== VALID_PASSWORD){
		res.status(400).json(response)
		return
	}
	res.status(200).json(
		{
			token: {
				access: ACCESS_TOKEN,
				refresh: REFRESH_TOKEN
			}
		}
	)
})

server.get('/api/wagtail/v2/pages/', (req, res)=>{
	try{
		const content = require('./services.json');
		res.status(200).json(content)
	} catch{
		res.status(500).json({error: 'Error reading content.'})
	}
})

server.post('/api/accounts/register', (req, res) => {
	const response = {
		password_confirm:["Passwords don't match"],
		non_field_errors:[]
	}

	const password = req.body.password;
	const password_confirm = req.body.password_confirm;

	if (password !== password_confirm){
		res.status(400).json(response)
		return
	}

	res.status(200).send('success')
})

server.get('/api/accounts/profile/', (req, res) => {
	const response = JSON.parse(
		'{"id":356,"username":"testUser","first_name":"","last_name":"","email":"testemail@gmail.com"}')

	res.status(200).json(response)
})

server.post('/api/accounts/change-password/', (req, res) => {
	const response = {
		password_confirm:["Passwords don't match"],
		non_field_errors:[]
	}

	const old_password = req.body.old_password;
	const password = req.body.password;
	const password_confirm = req.body.password_confirm;

	const data = {}
	let error = false;

	if (old_password !== VALID_PASSWORD) {
		data.old_password = ["Old password is not correct"]
		error = true;
	}

	if (password < 8){
		data.password = ["This password is too short. It must contain at least 8 characters."]
		error = true;
	} else if(password !== password_confirm){
		data.password_confirm = ["Passwords don't match"]
		error = true
	}

	if (error){
		res.status(400).json(data)
		return
	}

	res.status(200).json({detail:"Password changed successfully"})
})

server.use(router)

module.exports = {server}
