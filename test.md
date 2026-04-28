# Kontrakt API Frontendu: Grupy i Dostępy Użytkowników

## Ogólny format odpowiedzi

Wszystkie endpointy powinny używać spójnego formatu odpowiedzi:

json {   "data": {},   "meta": {},   "errors": [] } 

### Pola

- data — główny payload odpowiedzi  
- meta — dodatkowe metadane (zarezerwowane na przyszłość)  
- errors — lista błędów (pusta tablica przy sukcesie)  

### Przykład błędu

json {   "data": null,   "meta": {},   "errors": [     {       "code": "GROUP_NOT_FOUND",       "message": "Nie znaleziono grupy",       "details": {         "groupId": "group-1"       }     }   ] } 

---

# 1. Pobranie listy grup z rolami

## Cel

Frontend potrzebuje wyświetlić listę grup wraz z przypisanymi rolami.

## Endpoint

http GET /api/admin/v1/groups 

## Przykład odpowiedzi

json {   "data": [     {       "id": "group-1",       "name": "Administrators",       "description": "Użytkownicy z pełnym dostępem administracyjnym",       "status": "ACTIVE",       "roles": [         {           "id": "role-1",           "name": "READ_USERS",           "description": "Może przeglądać użytkowników",           "status": "ACTIVE"         },         {           "id": "role-2",           "name": "WRITE_USERS",           "description": "Może edytować użytkowników",           "status": "ACTIVE"         }       ]     }   ],   "meta": {},   "errors": [] } 

## DTO

ts type ApiResponse<T> = {   data: T;   meta: Record<string, unknown>;   errors: ApiError[]; };  type ApiError = {   code: string;   message: string;   details?: Record<string, unknown>; };  type GroupsResponse = ApiResponse<GroupWithRolesDto[]>;  type GroupWithRolesDto = {   id: string;   name: string;   description?: string;   status: 'ACTIVE' | 'INACTIVE';   roles: RoleDto[]; };  type RoleDto = {   id: string;   name: string;   description?: string;   status: 'ACTIVE' | 'INACTIVE'; }; 

---

# 2. Pobranie użytkowników z grupami i rolami

## Cel

Frontend potrzebuje wyświetlić listę użytkowników wraz z przypisanymi grupami.  
Role powinny być zagnieżdżone w grupach, ponieważ należą do grup.

## Endpoint

http GET /api/admin/v1/users-access 

## Przykład odpowiedzi

json {   "data": [     {       "user": {         "id": "user-1",         "name": "John Smith",         "email": "john.smith@example.com",         "status": "ACTIVE"       },       "groups": [         {           "id": "group-1",           "name": "Administrators",           "description": "Użytkownicy z pełnym dostępem administracyjnym",           "status": "ACTIVE",           "roles": [             {               "id": "role-1",               "name": "READ_USERS",               "description": "Może przeglądać użytkowników",               "status": "ACTIVE"             }           ]         },         {           "id": "group-2",           "name": "Auditors",           "description": "Dostęp tylko do odczytu",           "status": "ACTIVE",           "roles": [             {               "id": "role-3",               "name": "READ_AUDIT_LOGS",               "description": "Może przeglądać logi audytowe",               "status": "ACTIVE"             }           ]         }       ]     }   ],   "meta": {},   "errors": [] } 

## DTO

ts type UsersAccessResponse = ApiResponse<UserAccessDto[]>;  type UserAccessDto = {   user: UserDto;   groups: GroupWithRolesDto[]; };  type UserDto = {   id: string;   name: string;   email: string;   status: 'ACTIVE' | 'INACTIVE'; }; 

---

# Zasady kontraktu

## 1. API powinno zwracać DTO dostosowane do UI

Odpowiedź powinna być zaprojektowana pod use-case frontendu, a nie odzwierciedlać strukturę bazy danych.

Dobrze:

json {   "id": "group-1",   "name": "Administrators",   "description": "Grupa administratorów" } 

Źle:

json {   "entityId": "group-1",   "typecode": "GROUP",   "class": "SECURITY_OBJECT",   "code": "ADM" } 

---

## 2. Unikanie N+1 zapytań

Frontend nie powinien wykonywać wielu zapytań, aby złożyć dane.

API powinno zwracać dane zagregowane w jednym response.

---

## 3. Czytelne nazewnictwo

Używaj nazw zrozumiałych dla konsumenta API:

- id
- name
- description
- status
- user
- groups
- roles

Unikaj nazw technicznych:

- entityId
- typecode
- class
- objectCode
- securityObjectCode

---

## 4. Brak paginacji

Zakładany rozmiar danych jest niewielki:

- ~100 użytkowników
- ograniczona liczba grup i ról

Dlatego paginacja nie jest wymagana.

json "meta": {} 

---

## 5. Role wewnątrz grup

Struktura musi zachować hierarchię:

text user  └── groups[]       └── roles[] 

Nie:

text user  ├── groups[]  └── roles[] 

---

# Podsumowanie

Wymagane endpointy:

http GET /api/admin/v1/groups GET /api/admin/v1/users-access 

Format odpowiedzi:

json {   "data": [],   "meta": {},   "errors": [] } 
