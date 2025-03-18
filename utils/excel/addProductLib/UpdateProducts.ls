Public Sub UpdateProducts
	On Error GoTo processerror
	
	Dim session As New NotesSession
	Dim db As NotesDatabase
	Dim view As NotesView
	Dim doc As NotesDocument
	Set db = session.Currentdatabase
	Set view = db.GetView("(wszystkie)")
	
	view.AutoUpdate = False 'to prevent the view being refreshed every time you save a document.
	
	Dim FlagSave As Boolean
	newProd%=0
	updatedProd%=0	
	
	ForAll pr In produkty	
		Set doc = view.GetDocumentByKey(Trim(pr.IDHSAP), True)
		
		If(doc Is Nothing) Then
			'if doc doesn't exist - add new product	
			Set doc = db.CreateDocument()
			Call doc.ReplaceItemValue("FORM","karta")
			Call doc.ReplaceItemValue("k_updateStatus","NEW: " & Date$)
			
			Call doc.ReplaceItemValue("k_brend",	pr.brend)
			Call doc.ReplaceItemValue("k_kodGrupaGlowna",	pr.kodGrupaGlowna)
			Call doc.ReplaceItemValue("k_IDHSAP",	pr.IDHSAP)
			Call doc.ReplaceItemValue("k_indeksn",	pr.indeksn)
			Call doc.ReplaceItemValue("k_nazwa",	pr.nazwa)
			Call doc.ReplaceItemValue("k_jm",	pr.jm)
			Call doc.ReplaceItemValue("k_ilosc",	pr.ilosc)
			Call doc.ReplaceItemValue("k_iloscKarton",	pr.iloscKarton)
			Call doc.ReplaceItemValue("k_ilosczPaleta",	pr.ilosczPaleta)
			Call doc.ReplaceItemValue("k_price",	pr.price)
			Call doc.ReplaceItemValue("k_grupaGlowna",	pr.grupaGlowna) 
			Call doc.ReplaceItemValue("k_grupaPodrzedna",	pr.grupaPodrzedna)
			Call doc.ReplaceItemValue("k_typ2",	pr.typ2)
			Call doc.ReplaceItemValue("k_grupaCenowa",	pr.grupaCenowa)		

			Call doc.Save(True,False)
			
			'make computed fields recalculate
			If doc.ComputeWithForm(True, False) Then 
				Call doc.Save( False, False ) 
			Else 
				MessageBox "a validation formula failed for "  & CStr(pr.IDHSAP)  
			End If 
			Delete doc 'remove doc from cache (does Not Delete From database) 
			
			newProd% = newProd% + 1
		Else
			'check if some values are different from existing. If yes - update and save doc		
			FlagSave = False	
			
			If (CStr(doc.GetItemValue("k_brend")(0)) <> pr.brend) Then
				Call doc.ReplaceItemValue("k_brend",	pr.brend)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_kodGrupaGlowna")(0)) <> pr.kodGrupaGlowna) Then
				Call doc.ReplaceItemValue("k_kodGrupaGlowna",	pr.kodGrupaGlowna)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_IDHSAP")(0)) <> pr.IDHSAP) Then
				Call doc.ReplaceItemValue("k_IDHSAP",	pr.IDHSAP)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_indeksn")(0)) <> pr.indeksn) Then
				Call doc.ReplaceItemValue("k_indeksn",	pr.indeksn)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_nazwa")(0)) <> pr.nazwa) Then
				Call doc.ReplaceItemValue("k_nazwa",	pr.nazwa)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_jm")(0)) <> pr.jm) Then
				Call doc.ReplaceItemValue("k_jm",	pr.jm)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_ilosc")(0)) <> pr.ilosc) Then
				Call doc.ReplaceItemValue("k_ilosc",	pr.ilosc)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_iloscKarton")(0)) <> pr.iloscKarton) Then
				Call doc.ReplaceItemValue("k_iloscKarton",	pr.iloscKarton)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_ilosczPaleta")(0)) <> pr.ilosczPaleta) Then
				Call doc.ReplaceItemValue("k_ilosczPaleta",	pr.ilosczPaleta)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_price")(0)) <> pr.price) Then
				Call doc.ReplaceItemValue("k_price",	pr.price)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_grupaGlowna")(0)) <> pr.grupaGlowna) Then
				Call doc.ReplaceItemValue("k_grupaGlowna",	pr.grupaGlowna) 
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_grupaPodrzedna")(0)) <> pr.grupaPodrzedna) Then
				Call doc.ReplaceItemValue("k_grupaPodrzedna",	pr.grupaPodrzedna)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_typ2")(0)) <> pr.typ2) Then
				Call doc.ReplaceItemValue("k_typ2",	pr.typ2)
				FlagSave = True
			End If	
			If (CStr(doc.GetItemValue("k_grupaCenowa")(0)) <> pr.grupaCenowa) Then
				Call doc.ReplaceItemValue("k_grupaCenowa",	pr.grupaCenowa)	
				FlagSave = True
			End If	
							
											
			If (FlagSave) Then
				Call doc.ReplaceItemValue("k_updateStatus","Updated: " & Date$)
				Call doc.Save(True,False)
				
				'make computed fields recalculate
				If doc.ComputeWithForm(True, False) Then 
					Call doc.Save( False, False ) 
				Else 
					MessageBox "a validation formula failed for "  & CStr(pr.IDHSAP)  
				End If 
				Delete doc 'remove doc from cache (does Not Delete From database) 
				
				updatedProd% = updatedProd% + 1
			End If	
		End If
	End ForAll
	
	Call view.Refresh
	
	MessageBox "Добавлено " & newProd% & " новых продуктов. " & Chr(10) & "Обновлено: " & updatedProd%
	
	Exit Sub
processerror:
	Dim errorMessage As String
	
	errorMessage = |Произошла ошибка при попытке обновить продукт| & Chr(13) &_
	|Код ошибки: | & CStr(Err) & Chr(13) &_
	|Описание ошибки: | & Error$ & Chr(13) &_
	|Номер строки с ошибкой: | & CStr(Erl)  & Chr(13) &_
	|Пожалуйста, свяжитесь с администратором|
	
	MessageBox errorMessage, 16 , "[UpdateAddProducts][UpdateProducts] Произошла ошибка"
	Exit Sub
End Sub


