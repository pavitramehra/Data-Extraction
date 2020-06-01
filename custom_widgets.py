'''
* created on: 25-05-2020
* updated on: 01-06-2020
* author: raghav dalmia
'''

try:
    from tkinter import *
    from tkinter import filedialog
except ImportError:
    from Tkinter import *
    from Tkinter import filedialog


class browse_file_widget(Frame):
    def __init__(self, parent, text):
        Frame.__init__(self, parent)
        self.filename_label = Label(
            self,
            text=text)

        self.filename_entry = Entry(
            self,
            width=30)

        self.filename_browse_button = Button(
            self,
            text="Browse",
            command=self.browse_files)

        self.filename_label.pack(side=LEFT)
        self.filename_entry.pack(side=LEFT)
        self.filename_browse_button.pack(side=LEFT)

    def get(self):
        return self.filename_entry.get()

    def browse_files(self):
        initial_path = self.filename_entry.get()
        file_path = filedialog.askopenfilename(
            initialdir=initial_path,
            filetypes=(
                ("csv", "*.csv"),
                ("all files", "*.*")
            ))
        self.filename_entry.insert(END, file_path)


class entry_form_widget(Frame):
    def __init__(self, parent, text):
        Frame.__init__(self, parent)
        self.label = Label(
            self,
            text=text,
            width=20)

        self.entry = Entry(self)

        self.label.grid(row=0, column=0)
        self.entry.grid(row=0, column=1)

    def get(self):
        return self.entry.get()
