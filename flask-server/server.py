from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os
import logging
from logging.handlers import RotatingFileHandler
from ldap3 import Server, Connection, ALL, NTLM
from Crypto.Hash import MD4
import uuid



curDirectory = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app, origins="*")

# Configure logging to use a directory with write permissions
log_file_path = r'C:\inetpub\wwwroot\logs\app.log'
handler = RotatingFileHandler(log_file_path, maxBytes=10000, backupCount=1)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
app.logger.addHandler(handler)
app.logger.setLevel(logging.DEBUG)

LDAP_SERVER = 'ldap://168.10.10.1'
LDAP_USER = 'SDC\\ldapuser'
LDAP_PASSWORD = 'Qwerty123'

@app.route('/api/user')
def user_info():
    try:
        user = request.environ.get('REMOTE_USER')
        app.logger.debug(f"REMOTE_USER: {user}")
        if user:
            username = user.split('\\')[-1]  # Extract username from DOMAIN\username
            server = Server(LDAP_SERVER, get_info=ALL)
            conn = Connection(server, user=LDAP_USER, password=LDAP_PASSWORD, authentication=NTLM)
            if not conn.bind():
                app.logger.error(f"Failed to bind to LDAP server: {conn.last_error}")
                return jsonify({'message': 'Internal server error'}), 500
            
            # Search for user information
            search_filter = f'(sAMAccountName={username})'
            conn.search('dc=sdc,dc=test', search_filter, attributes=[
                    'cn', 'givenName', 'sn', 'mail', 'userPrincipalName', 'displayName', 
                    'telephoneNumber', 'mobile', 'title', 'department', 'company', 
                    'employeeID', 'manager', 'streetAddress', 'postalCode', 'l', 'st', 'co', 
                    'memberOf', 'objectGUID'
                ]
            )
            if not conn.entries:
                return jsonify({'message': 'User not found'}), 404
            
            user_info = conn.entries[0]

            guid = None
            if 'objectGUID' in user_info:
                object_guid = user_info.objectGUID.value
                app.logger.debug(f"Raw objectGUID: {object_guid}")
                if len(object_guid) == 16:
                    try:
                        guid = str(uuid.UUID(bytes_le=object_guid))
                    except ValueError as e:
                        app.logger.error(f"Error converting objectGUID: {e}")
                else:
                    app.logger.error(f"objectGUID length is not 16: {len(object_guid)}")
            
            return jsonify({
                'username': username,
                'full_name': user_info.cn.value,
                'first_name': user_info.givenName.value if 'givenName' in user_info else None,
                'last_name': user_info.sn.value if 'sn' in user_info else None,
                'email': user_info.mail.value if 'mail' in user_info else None,
                'user_principal_name': user_info.userPrincipalName.value if 'userPrincipalName' in user_info else None,
                'display_name': user_info.displayName.value if 'displayName' in user_info else None,
                'telephone_number': user_info.telephoneNumber.value if 'telephoneNumber' in user_info else None,
                'mobile_number': user_info.mobile.value if 'mobile' in user_info else None,
                'job_title': user_info.title.value if 'title' in user_info else None,
                'department': user_info.department.value if 'department' in user_info else None,
                'company': user_info.company.value if 'company' in user_info else None,
                'employee_id': user_info.employeeID.value if 'employeeID' in user_info else None,
                'manager': user_info.manager.value if 'manager' in user_info else None,
                'street_address': user_info.streetAddress.value if 'streetAddress' in user_info else None,
                'postal_code': user_info.postalCode.value if 'postalCode' in user_info else None,
                'city': user_info.l.value if 'l' in user_info else None,
                'state': user_info.st.value if 'st' in user_info else None,
                'country': user_info.co.value if 'co' in user_info else None,
                'member_of': user_info.memberOf.value if 'memberOf' in user_info else None,
                'object_guid': guid
            })
        else:
            return jsonify({'message': 'User not authenticated'}), 401
    except Exception as e:
        app.logger.error(f"Error in /api/user route: {e}")
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify(message="hi")

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

@app.route("/userinfo")
def userinfo():
    username = request.environ.get('REMOTE_USER')
    return username

@app.route("/test")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
