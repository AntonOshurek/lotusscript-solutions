Class Produkt
	
	Public brend As String 'k_brend A: Бренд
	Public kodGrupaGlowna As String 'k_kodGrupaGlowna B: SAP группа продукта
	Public IDHSAP As String 'k_IDHSAP C: IDH SAP
	Public indeksn As String 'k_indeksn D: Код продукта
	Public nazwa As String 'k_nazwa E: Найменування
	Public jm As String 'k_jm F: Единица измерения
	Public ilosc As String 'k_ilosc G: Количество в упаковке
	Public iloscKarton As String 'k_iloscKarton H: Количество штук в коробке
	Public ilosczPaleta As String 'k_ilosczPaleta I: Количество штук на палете
	Public price As String 'k_price J: Цена прайса
	Public grupaGlowna As String 'k_grupaGlowna K: Главная группа 
	Public grupaPodrzedna As String 'k_grupaPodrzedna L: Второстепенная группа
	Public typ2 As String 'k_typ2 M: Группа продукта
	Public grupaCenowa As String 'k_grupaCenowa N: Ценовая группа 
	
	Public Sub New (idh As String)
		IDHSAP=idh
	End Sub
	
End Class
