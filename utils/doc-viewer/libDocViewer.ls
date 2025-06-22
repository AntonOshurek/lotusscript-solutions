%REM
	Library libDocViewer
	Created Jun 21, 2025 by Anton Oshurek/unicorn poznan
	Description: Comments for Library
%END REM
Option Public
Option Declare

Sub Initialize
	
End Sub


Function GetItemTypeName(t As Integer) As String
    Select Case t
    Case 1: GetItemTypeName = "RICHTEXT"
    Case 4: GetItemTypeName = "UNKNOWN(4)"
    Case 512: GetItemTypeName = "EMBEDDEDOBJECT"
    Case 768: GetItemTypeName = "NUMBER"
    Case 1024: GetItemTypeName = "DATETIME"
    Case 1074: GetItemTypeName = "AUTHORS"
    Case 1075: GetItemTypeName = "NAMES"
    Case 1076: GetItemTypeName = "READERS"
    Case 1077: GetItemTypeName = "WRITERS"
    Case 1280: GetItemTypeName = "TEXT"
    Case Else
        GetItemTypeName = "UNKNOWN(" & CStr(t) & ")"
    End Select
End Function
Public Sub LoadDocumentFieldsIntoRichText(doc As NotesDocument)
	
	On Error GoTo errhandle
	Dim errorMessageHeader As String
	Dim customerErrorMessage As String
	errorMessageHeader = "[library][funcname] Błąd!"
	customerErrorMessage = "Przy próbie w trakcie Przy zmianie wystąpił nieoczekiwany błąd."
	
	Dim rt As NotesRichTextItem
	
	If doc.HasItem("docfields") Then
		Call doc.RemoveItem("docfields")
	End If
	Set rt = New NotesRichTextItem(doc, "docfields")

	Dim item As NotesItem
	
	ForAll i In doc.Items
		Set item = i
		
		Dim fieldLabel As String
		fieldLabel = item.Name & " (" & GetItemTypeName(CInt(item.Type)) & ")"
		Dim maxLen As Integer
		maxLen = 40
		Dim spaces As String
		spaces = String(maxLen - Len(fieldLabel), " ")
		If Len(spaces) < 1 Then spaces = " "

		Call rt.AppendText(fieldLabel  & ": " & spaces)
		
		Select Case item.Type
		Case 1
			Dim rtItemValue As NotesRichTextItem
			Set rtItemValue = doc.GetFirstItem(item.Name)
			If Not rtItemValue Is Nothing Then
				Call rt.AppendText(rtItemValue.GetFormattedText(False, 0))
			Else
				Call rt.AppendText("[RichText empty]")
			End If

		Case 512, 32768
			Call rt.AppendText("[Embedded Object]")

		Case Else
			ForAll v In item.Values
				Call rt.AppendText(CStr(v) & " ")
			End ForAll
		End Select
		
		Call rt.AddNewLine(1)
		Call rt.AppendText(String(75, "-")) 
		Call rt.AddNewLine(1)
	End ForAll
	
	Dim rtSource As NotesRichTextItem
	Set rtSource = doc.GetFirstItem("Body")
	If Not rtSource Is Nothing Then
		If rtSource.Type = RICHTEXT Then
			If IsArray(rtSource.EmbeddedObjects) Then
				If UBound(rtSource.EmbeddedObjects) >= 0 Then
					Dim obj As NotesEmbeddedObject
					Dim tmpFilePath As String

					ForAll eo In rtSource.EmbeddedObjects
						Set obj = eo
						
						tmpFilePath = Environ$("TEMP") & "\" & obj.Name
						Call obj.ExtractFile(tmpFilePath)
						
						Call rt.EmbedObject(EMBED_ATTACHMENT, "", tmpFilePath)
					End ForAll
				End If
			End If
		End If
	End If
	
	Exit Sub

errhandle:
	Dim session As New NotesSession
	Dim errorMessage As String
	Dim fullErrorMessage As String
	Dim currentDb As NotesDatabase
	Set currentDb = session.CurrentDatabase

	errorMessage = "Wystąpił błąd!" & Chr(10) & _
	"Kod błędu: " & CStr(Err) & Chr(10) & _
	"Opis błędu: " & Error$ & Chr(10) & _
	"Moduł: " & GetThreadInfo(1) & Chr(10) & _
	"Linia: " & CStr(Erl) & Chr(10) & _
	"Baza danych: " & currentDb.Title

	fullErrorMessage = customerErrorMessage & Chr(10) & Chr(10) & errorMessage

	MessageBox fullErrorMessage, 16, errorMessageHeader
End Sub
