# Lotus Notes DocViewer (Universal Document Viewer)

This project contains the `libDocViewer` library, which renders all fields of any document (including system fields, attachments, and RichText) into a formatted RichText block.

---

## 🔧 Installation

### 1. 📁 Add the library to your database

Create a **LotusScript Library** named `libDocViewer` and paste the contents of the `libDocViewer.lss` file into it.

---

### 2. 📄 Create the form `DocViewer`

Create a new form in your database and name it **exactly**:

```
DocViewer
```

- Open the form properties and enable:
  - ✅ **Default form for new documents**

---

### 3. 🧱 Add the field

Insert a **Rich Text field** into the form with the exact name:

```
docfields
```

📌 This field will be automatically populated by the script when the document is opened.

---

### 4. 💡 Add code to the `Queryopen` event

In the `DocViewer` form, open the **Queryopen** event and add the following code:

```lotusscript
Sub Queryopen(Source As Notesuidocument, Mode As Integer, Isnewdoc As Variant, Continue As Variant)
	Call LoadDocumentFieldsIntoRichText(Source.Document)
End Sub
```

- In the **Declarations section** of the form, make sure to add:

```lotusscript
Option Public
Use "libDocViewer"
```

---

## 🧪 What the script does

- Clears and fills the `docfields` Rich Text field;
- Inserts into it:
  - all fields from the document with aligned formatting;
  - RichText field contents;
  - all attached files, extracted from the `Body` field and re-attached.

---

## ⚠️ Notes

- The document is not modified by the user — `docfields` is generated on document open;
- System and hidden fields are supported;
- Attachments are physically embedded using `EmbedObject`.

---

## 🛠️ Author

- Developed by: Anton Oshurek / unicorn poznan  
- Date: 2025-06-21  
- Project: `libDocViewer`
