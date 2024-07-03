%REM
	Library trim-symbols-in-string
	Created Jun 13, 2024 by Grzegorz Pawlak/Ext/PL/EMEA/HENKEL
	Description: Comments for Library
%END REM
Option Public
Option Declare

Function ReplaceSubstring(source As String, find As String, replaceWitch As String) As String
	On Error GoTo processerror
	
	Dim pos As Integer
	pos = InStr(source, find)
	
	While pos > 0
		source = Left(source, pos - 1) & replaceWitch & Mid(source, pos + Len(find))
		pos = InStr(source, find)
	Wend
	
	ReplaceSubstring = source
	
processend:
	Exit Function	
processerror:
	MessageBox "[Library trim-symbols-in-string] Error in ReplaceSubstring - " & Err & "/line:" & Erl & " - " & Error, 0 , "ERROR!"
End Function

Function RemoveAllSpaces(inputString As String) As String
	On Error GoTo processerror
	
	inputString = ReplaceSubstring(inputString, " ", "")
	inputString = ReplaceSubstring(inputString, Chr(9), "")
	inputString = ReplaceSubstring(inputString, Chr(10), "")
	inputString = ReplaceSubstring(inputString, Chr(13), "")
	inputString = ReplaceSubstring(inputString, Chr(160), "")
	RemoveAllSpaces = inputString
	
processend:
	Exit Function	
processerror:
	MessageBox "[Library trim-symbols-in-string] Error in RemoveAllSpaces - " & Err & "/line:" & Erl & " - " & Error, 0 , "ERROR!"
End Function
