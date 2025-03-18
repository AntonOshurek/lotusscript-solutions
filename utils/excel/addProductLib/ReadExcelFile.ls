Public Sub ReadExcelFile(filename As Variant)
	On Error GoTo processerror
	
	Dim prod As Produkt
	
	Dim xlsApp As Variant
	Dim wb As Variant
	Dim DataArray
	Dim actRows As Integer
	Dim actColumns As Integer
	Dim rowNum As Integer
	rowNum = 2 'odczytujemy plik zaczynajac od 2 wiersza (bez naglowkow)

	'open excel file
	Set xlsApp = CreateObject("Excel.application")
	xlsApp.Visible=False
	Call xlsApp.Workbooks.Open(filename(0))
	Set wb = xlsApp.Workbooks(1).Worksheets(1)
	actRows = wb.UsedRange.Rows.Count + 1
	actColumns = wb.UsedRange.Columns.Count
	ReDim DataArray(actRows, actColumns) As String
	DataArray = wb.Range("A1").Resize(actRows, actColumns).Value
	
	'get data from excel and put to the produkty list
	While CStr(DataArray(rowNum,3)) <>"" 'k_IDHSAP
		' for every line create new product form class Product
		Set prod = New Produkt(CStr(DataArray(rowNum,3) ))
		
		prod.brend = CStr(DataArray(rowNum, 1)) 'k_brend A: Бренд
		prod.kodGrupaGlowna = CStr(DataArray(rowNum, 2)) 'k_kodGrupaGlowna B: SAP группа продукта
		prod.IDHSAP = RemoveAllSpaces(CStr(DataArray(rowNum, 3))) 'k_IDHSAP C: IDH SAP
		prod.indeksn = CStr(DataArray(rowNum, 4)) 'k_indeksn D: Код продукта
		prod.nazwa = CStr(DataArray(rowNum, 5)) 'k_nazwa E: Найменування
		prod.jm = CStr(DataArray(rowNum, 6)) 'k_jm F: Единица измерения
		prod.ilosc = CDbl(DataArray(rowNum, 7)) 'k_ilosc G: Количество в упаковке
		prod.iloscKarton = CDbl(DataArray(rowNum, 8)) 'k_iloscKarton H: Количество штук в коробке
		prod.ilosczPaleta = CDbl(DataArray(rowNum, 9)) 'k_ilosczPaleta I: Количество штук на палете
		prod.price = CDbl(DataArray(rowNum, 10)) 'k_price J: Цена прайса
		prod.grupaGlowna = CStr(DataArray(rowNum, 11)) 'k_grupaGlowna K: Главная группа 
		prod.grupaPodrzedna = CStr(DataArray(rowNum, 12)) 'k_grupaPodrzedna L: Второстепенная группа
		prod.typ2 = CStr(DataArray(rowNum, 13)) 'k_typ2 M: Группа продукта
		prod.grupaCenowa = CStr(DataArray(rowNum, 14)) 'k_grupaCenowa N: Ценовая группа 

		'add newly created product to the produkty list
		If(prod.IDHSAP<>"") Then
			Set	produkty(CStr(DataArray(rowNum,3)))=prod			
		End If	
		
		rowNum =  rowNum + 1
	Wend	
	
	Call xlsApp.Quit

	Exit Sub
processerror:
	Call xlsApp.Quit
	Dim errorMessage As String
	
	errorMessage = |Произошла ошибка при попытке прочитать EXCEL файл| & Chr(13) &_
	|Код ошибки: | & CStr(Err) & Chr(13) &_
	|Описание ошибки: | & Error$ & Chr(13) &_
	|Номер строки с ошибкой: | & CStr(Erl)  & Chr(13) &_
	|Пожалуйста, свяжитесь с администратором|
	
	MessageBox errorMessage, 16 , "[UpdateAddProducts][ReadExcelFile] Произошла ошибка"
	Exit Sub
End Sub

