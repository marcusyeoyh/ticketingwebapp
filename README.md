# Ticketing WebApp
Ticketing service to better manage the raising, approval and managing of software related processes


## Starting flask server
1.  cd to flask server
2.  Activate virtual environment

```
.venv\Scripts\activate
```
3. Define file to be run
```
set FLASK_APP=server.py
```
4. Run the flask app
```
flask run --host=0.0.0.0 --port=5000
```

## Start React server
1. cd to client
2. Build react client if changes are made (optional)
```
npm run Build
```
3. Serve React frontend
```
npx serve -s build -l 3000
```

## API Reference

#### Get test information

```http
  GET /api/test
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `server_ip_address` | `string` | **Required**. server API address |

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`API_KEY` = http://168.10.10.1/


