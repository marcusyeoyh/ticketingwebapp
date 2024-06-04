from flask import Flask, jsonify
from flask_cors import CORS
import sqlite3
import os

curDirectory = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app, origins="*")

@app.route("/testdb")
def testdb():
    connection = sqlite3.connect(os.path.join(curDirectory, "db-test.db"))
    cursor = connection.cursor()
    query = "SELECT * FROM members"
    cursor.execute(query)
    results = cursor.fetchall()
    cursor.close()
    connection.close()

    # Assuming 'members' table has a single column
    members = [row[0] for row in results]

    return jsonify({"members": members})

@app.route("/test")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

if __name__ == "__main__":
    app.run(debug=True)
