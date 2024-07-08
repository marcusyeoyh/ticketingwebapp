from ldap3 import Server, Connection, ALL, NTLM

LDAP_SERVER = 'ldap://168.10.10.1'
LDAP_USER = 'SDC\\ldapuser'
LDAP_PASSWORD = 'Qwerty123'

def get_user_info(username):
    try:
        server = Server(LDAP_SERVER, get_info=ALL)
        conn = Connection(server, user=LDAP_USER, password=LDAP_PASSWORD, authentication=NTLM)
        if not conn.bind():
            return None
        
        search_filter = f'(sAMAccountName={username})'
        conn.search('dc=sdc,dc=test', search_filter, attributes=[
            'cn', 'givenName', 'sn', 'mail', 'userPrincipalName', 'displayName',
            'telephoneNumber', 'mobile', 'title', 'department', 'company',
            'employeeID', 'manager', 'streetAddress', 'postalCode', 'l', 'st', 'co',
            'memberOf'
        ])
        if not conn.entries:
            return None
        
        user_info = conn.entries[0]
        return {
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
            'member_of': user_info.memberOf.value if 'memberOf' in user_info else None
        }
    except Exception as e:
        return None
