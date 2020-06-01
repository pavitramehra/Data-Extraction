def vaild_ip(_ip):
    return "".join(_ip.split('.')).isnumeric() and _ip.count('.') == 3

def vaild_port(_port):
    return _port.isnumeric()