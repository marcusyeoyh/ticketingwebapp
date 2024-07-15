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

def get_users(userGroup):
    try:
        server = Server(LDAP_SERVER, get_info=ALL)
        conn = Connection(server, user=LDAP_USER, password=LDAP_PASSWORD, authentication=NTLM)
        if not conn.bind():
            return None
        
        # Search for the relevant group
        group_search_filter = f'(cn={userGroup})'
        group_search_base = 'DC=sdc,DC=test'
        conn.search(group_search_base, group_search_filter, attributes=['distinguishedName'])
        if not conn.entries:
            print(f"Group '{userGroup}' not found")
            return None
        
        group_dn = conn.entries[0].distinguishedName.value
        
        # Search for users who are members of the specified group
        user_search_filter = f'(&(objectClass=user)(memberOf={group_dn}))'
        user_search_base = 'DC=sdc,DC=test'
        conn.search(user_search_base, user_search_filter, attributes=['sAMAccountName', 'cn'])
        
        users = []
        for entry in conn.entries:
            user_info = {
                'username': entry.sAMAccountName.value,
                'full_name': entry.cn.value
            }
            users.append(user_info)
        
        return users
    except Exception as e:
        print(f"An error occurred: {e}")
        return None