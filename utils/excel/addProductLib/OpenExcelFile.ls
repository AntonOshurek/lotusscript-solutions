Function OpenExcelFile()
	On Error GoTo processerror
	
	Dim session As New NotesSession
	Dim db As NotesDatabase
	Set db = session.Currentdatabase

	Dim ws As New NotesUIWorkspace
	Dim filePath As Variant
	
	'show info message about excel file
	Dim twoLiner As String
	twoLiner = | В файле должны быть следующие колонки в ниже указанном порядке:
	A: Бренд
	B: SAP группа продукта
	C: IDH SAP
	D: Код продукта
	E: Найменування
	F: Единица измерения
	G: Количество в упаковке
	H: Количество штук в коробке
	I: Количество штук на палете
	J: Цена прайса
	K: Главная группа
	L: Второстепенная группа
	M: Группа продукта
	N:  Ценовая группа |

	answ% = MessageBox (twoLiner, 1, "Продолжить?")
	If answ%=2 Then
		Exit Function	
	End If
	
	'choose the excel file from any localization on the computer
	filePath = ws.OpenFileDialog(False, "Выберите файл", "|*.csv|*.xlsx|*.xls", "")
	If IsEmpty(filePath) Then
		MessageBox "Не выбрано файл!", 0 , "Error!"
		Exit Function	
	End If

	'read excel and then update/add products
	Call ReadExcelFile(filePath)
	Call UpdateProducts()
	
	'refresh fields in view
	Dim workspace As New NotesUIWorkspace
	Call workspace.ViewRefresh

	Exit Function	
processerror:
	Dim errorMessage As String
	
	errorMessage = |Произошла ошибка при попытке открыть EXCEL файл| & Chr(13) &_
	|Код ошибки: | & CStr(Err) & Chr(13) &_
	|Описание ошибки: | & Error$ & Chr(13) &_
	|Номер строки с ошибкой: | & CStr(Erl)  & Chr(13) &_
	|Пожалуйста, свяжитесь с администратором|
	
	MessageBox errorMessage, 16 , "[UpdateAddProducts][OpenExcelFile] Произошла ошибка"
	Exit Function	
End Function

