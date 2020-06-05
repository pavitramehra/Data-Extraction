'''
* created on: 27-05-2020
* updated on: 01-06-2020
* author: raghav dalmia
'''
import cx_Oracle

# Messages
STATUS_CONNECTED = "Connected to {}."
STATUS_NOT_CONNECTED = "No connection available."


class dao():
    def __init__(self):
        self.db_name = None
        self.cursor = None

    def auth(self, _db_name, _db_password, _db_port, _db_ip):
        creds = _db_name + '/' + _db_password + '@' + _db_port + '/' + _db_ip
        try:
            self.cursor = cx_Oracle.connect(creds).cursor()
            self.db_name = _db_name
        except BaseException:
            pass

    def get_status(self):
        if(self.cursor!=None):
            return STATUS_CONNECTED.format(self.db_name), "green"
        else:
            return STATUS_NOT_CONNECTED, "red"

    def service(self, source_file, destination_file):
        print("hello")
        # pass
