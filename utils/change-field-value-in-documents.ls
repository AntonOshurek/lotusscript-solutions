Option Public
Option Declare

Sub Initialize
	Dim session As New NotesSession
	Dim db As NotesDatabase
	Dim dc As notesdocumentcollection
	Dim doc, tmp As notesdocument
	Dim field As String
	Dim value As String
	Dim splittedValue As Variant
	Dim i As Integer
	
	On Error GoTo processerror
	
	Set db = session.Currentdatabase
	Set dc = db.Unprocesseddocuments
	Set doc = dc.Getfirstdocument()
	
	field = InputBox$("Wprowadz dane", "Podaj nazwe pola: ", "")
	If field = "" Then			
		MsgBox "Nic nie wpisano lub wciśnięto Cancel. Przerywam wykonanie."
		GoTo processend
	End If
		
	value = InputBox$("Wprowadz dane (raz dla wszystkich zaznaczonych!)", "Podaj nowa wartosc dla pola " + field + ": ", doc.Getitemvalue(field)(0))
	If value = "" Then
		MsgBox "Nic nie wpisano lub wciśnięto Cancel. Przerywam wykonanie."
		GoTo processend
	End If
	
	splittedValue = Split(value, ";")
	
	While Not doc Is Nothing
		Set tmp = dc.Getnextdocument(doc)
		
		If Not doc.Hasitem(field) Then
			MsgBox "We wskazanym dokumencie nie ma pola o podanej nazwie"
		Else
			If InStr(value, ";") Then
				Call doc.Replaceitemvalue(field, splittedValue)		
			Else
				Call doc.Replaceitemvalue(field, value)			
			End If

			Call doc.Save(True,True)

			'MsgBox "Wartosc pola "+ field +" we wskazanym dokumencie zostala zmieniona na " + value + "."
		End If
		
		Set doc = tmp
	Wend
	
processend:
	Exit Sub
processerror:
	Print "Blad w agencie - " & Err & "/" & Erl & " - " & error	
End Sub
