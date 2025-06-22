Sub Queryopen(Source As Notesuidocument, Mode As Integer, Isnewdoc As Variant, Continue As Variant)
	Call LoadDocumentFieldsIntoRichText(Source.Document)
End Sub
