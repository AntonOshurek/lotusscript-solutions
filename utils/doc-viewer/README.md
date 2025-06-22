# Lotus Notes DocViewer (Universal Document Viewer)

Этот проект содержит библиотеку `libDocViewer`, которая позволяет отображать все поля любого документа (включая системные, вложения и RichText) в виде форматированного RichText.

---

## 🔧 Установка

### 1. 📁 Добавьте библиотеку в базу

Создайте **LotusScript Library** с именем `libDocViewer` и вставьте туда содержимое из файла `libDocViewer.ls`.

---

### 2. 📄 Создайте форму `DocViewer`

Создайте форму в базе и назовите её **строго**:
DocViewer

- Откройте свойства формы и установите флаг:
  - ✅ **Default form for new documents** (Форма по умолчанию)

---

### 3. 🧱 Добавьте поле

Вставьте в форму **Rich Text поле** с точным именем:
docfields

📌 Это поле будет автоматически заполняться скриптом при открытии документа.

---

### 4. 💡 Добавьте код в событие `Queryopen`

В свойствах формы `DocViewer`, откройте событие `Queryopen` и вставьте код:

````lotusscript
Sub Queryopen(Source As Notesuidocument, Mode As Integer, Isnewdoc As Variant, Continue As Variant)
	Call LoadDocumentFieldsIntoRichText(Source.Document)
End Sub
````

- В **объявлениях формы (`Declarations`) обязательно добавить**:

  ```lotusscript
  Option Public
  Use "libDocViewer"
  ````


## 🧪 Что делает скрипт

- Очищает и заполняет поле `docfields`;
- Вставляет в него:
  - все поля документа с выравниванием;
  - значения RichText-полей;
  - все прикреплённые файлы, извлекая их из `Body` и вставляя заново.

---

## ⚠️ Примечания

- Документ не изменяется пользователем — `docfields` формируется при открытии;
- Поддерживаются системные и скрытые поля;
- Прикреплённые файлы вставляются физически (через `EmbedObject`).

---

## 🛠️ Автор

- Разработано: Anton Ashurek / unicorn poznan
- Дата: 2025-06-21
- Проект: `libDocViewer`
