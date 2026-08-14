const TRANSACTION_PW_FIELDS: Record<TransactionPwFieldName, Field> = {
  id: { label: 'ID' },
  dr_value_date: { label: 'Data waluty obciążenia' },
  contract_ref_no: { label: 'Numer referencyjny kontraktu' },
  lcy_equivalent: { label: 'Równowartość w walucie lokalnej' },
  txn_ccy: { label: 'Waluta transakcji' },
  txn_amount: { label: 'Kwota transakcji' },
  exch_rate: { label: 'Kurs wymiany' },
  department_code: { label: 'Kod departamentu' },
  transfer_type: { label: 'Typ przelewu' },

  dr_ac_brn: { label: 'Oddział rachunku obciążanego' },
  dr_account: { label: 'Rachunek obciążany' },
  dr_ac_ccy: { label: 'Waluta rachunku obciążanego' },
  dr_amount: { label: 'Kwota obciążenia' },

  cr_ac_brn: { label: 'Oddział rachunku uznawanego' },
  cr_ac_no: { label: 'Rachunek uznawany' },
  cr_ac_ccy: { label: 'Waluta rachunku uznawanego' },
  cr_amount: { label: 'Kwota uznania' },

  payment_type: { label: 'Typ płatności' },
  account_class_cr: { label: 'Klasa rachunku uznawanego' },
  network_code: { label: 'Kod sieci' },
  product_code: { label: 'Kod produktu' },
  source_code: { label: 'Kod źródła' },
  customer_category_cr: { label: 'Kategoria klienta uznawanego' },
  gfcid_cr: { label: 'GFCID odbiorcy' },

  beneficiary1: { label: 'Odbiorca 1' },
  beneficiary2: { label: 'Odbiorca 2' },
  beneficiary3: { label: 'Odbiorca 3' },
  beneficiary5: { label: 'Odbiorca 5' },

  ordering_customer1: { label: 'Zleceniodawca 1' },
  ordering_customer2: { label: 'Zleceniodawca 2' },
  ordering_customer3: { label: 'Zleceniodawca 3' },

  sndr_to_rcvr_info1: { label: 'Informacje od nadawcy do odbiorcy 1' },
  sndr_to_rcvr_info2: { label: 'Informacje od nadawcy do odbiorcy 2' },
  sndr_to_rcvr_info3: { label: 'Informacje od nadawcy do odbiorcy 3' },
  sndr_to_rcvr_info4: { label: 'Informacje od nadawcy do odbiorcy 4' },

  country_out: { label: 'Kraj docelowy' },
  transfer_in: { label: 'Przelew przychodzący' },
  trn_desc: { label: 'Opis transakcji' },
  trn_code: { label: 'Kod transakcji' },
  drcr_ind: { label: 'Wskaźnik obciążenia/uznania' },

  payment_details1: { label: 'Szczegóły płatności 1' },
  payment_details2: { label: 'Szczegóły płatności 2' },
  payment_details3: { label: 'Szczegóły płatności 3' },
  payment_details4: { label: 'Szczegóły płatności 4' },

  trans_mode: { label: 'Tryb transakcji' },
  txn_init_date: { label: 'Data inicjacji transakcji' },
  transaction_id: { label: 'Identyfikator transakcji' },

  addressfree: { label: 'Adres – tekst dowolny' },
  addr_street: { label: 'Ulica' },
  addr_town: { label: 'Miejscowość' },
  addr_country_code: { label: 'Kod kraju' },

  trans_type: { label: 'Rodzaj transakcji' },
  t_from: { label: 'Transakcja od' },
  t_to_my_client: { label: 'Transakcja do mojego klienta' },

  from_account: { label: 'Rachunek nadawcy' },
  to_account: { label: 'Rachunek odbiorcy' },
  from_subject_to_subject: { label: 'Od podmiotu do podmiotu' },

  source_system: { label: 'System źródłowy' },
  record_status: { label: 'Status rekordu' },
  version_no: { label: 'Numer wersji' },
  created_on: { label: 'Data utworzenia' },
  created_by: { label: 'Utworzone przez' },
};
