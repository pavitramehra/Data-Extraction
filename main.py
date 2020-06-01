'''
* created on: 25-05-2020
* updated on: 01-06-2020
* author: raghav dalmia
'''

from dao import *
from utils import *
from custom_widgets import *

try:
    from tkinter import *
    from tkinter import filedialog, messagebox, ttk
except ImportError:
    from Tkinter import *
    from Tkinter import filedialog, messagebox, ttk


def connect_db():

    def connect_session():
        _db_name = db_name.get()
        _db_password = db_password.get()
        _db_port = db_port.get()
        _db_ip = db_ip.get()

        if(len(_db_name) == 0 or len(_db_password) == 0 or len(_db_port) == 0 or len(_db_ip) == 0):
            messagebox.showerror(
                "Entry Missing",
                "All the fields are mandatory!!")
        else:

            _dao.auth(_db_name, _db_password, _db_port, _db_ip)

            # if(response[0]=="ok"):
            #     connect_db_window.destroy()
            #     messagebox.showinfo(response[0],response[1])
            # else:
            #     messagebox.showerror(response[0],response[1])

            status = _dao.get_status()
            status_bar.config(text=status[0], fg=status[1])
            connect_db_window.destroy()

    connect_db_window = Toplevel(window)
    connect_db_window.title("Connect to Database*")
    connect_db_window.focus_force()

    db_name = entry_form_widget(connect_db_window, text="Database Name*")
    db_name.grid(row=0, column=1)

    db_password = entry_form_widget(
        connect_db_window,
        text="Database Password*")
    db_password.grid(row=1, column=1)

    db_port = entry_form_widget(connect_db_window, text="Port Number*")
    db_port.grid(row=2, column=1)

    db_ip = entry_form_widget(connect_db_window, text="IP Address*")
    db_ip.grid(row=3, column=1)

    connect_button = Button(
        connect_db_window,
        text="Connect",
        command=connect_session)
    connect_button.grid(row=4, columnspan=2)


def main():
    global window, status_bar, _dao

    _dao = dao()
    window = Tk()
    window.title("DB to CSV - 1.0")
    icon = Image("photo", file="/home/raghav/Desktop/Nucleus/icon.png")
    window.tk.call("wm", "iconphoto", window._w, icon)

    top_bar = Frame(window)
    top_bar.grid(row=0)

    status = _dao.get_status()
    status_bar = Label(top_bar, text=status[0], fg=status[1], width=35)
    status_bar.pack(side=LEFT)
    connect_button = Button(top_bar, text="Connect to DB", command=connect_db)
    connect_button.pack(side=RIGHT)

    ttk.Separator(orient="horizontal").grid(row=1, sticky="ew")

    input_file_widget = browse_file_widget(window, "Input File*  ")
    input_file_widget.grid(row=2)

    output_file_widget = browse_file_widget(window, "Output File*")
    output_file_widget.grid(row=3)

    def call_service():
        if(_dao.get_status()[1] == "red"):
            messagebox.showerror(
                "Connection error",
                "No connection avaliable!!")
        else:
            source_file = input_file_widget.get()
            destination_file = output_file_widget.get()
            if(len(source_file) == 0 or len(destination_file) == 0):
                messagebox.showerror(
                    "Entry Missing", "All the fields are mandatory!!")
            else:
                _dao.service(source_file, destination_file)
                messagebox.showinfo("Done", "Successfully imported!!")

    service_button = Button(window, text="Import", command=call_service)
    service_button.grid(row=4)

    window.mainloop()


if __name__ == "__main__":
    main()
