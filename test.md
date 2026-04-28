# Kontrakt API Frontendu: Grupy i Dostępy Użytkowników

## Ogólny format odpowiedzi

Wszystkie endpointy powinny używać spójnego formatu odpowiedzi:

```json
{
  "data": {},
  "meta": {},
  "errors": []
}
```

### Pola

- `data` — główny payload odpowiedzi
- `meta` — dodatkowe metadane (zarezerwowane na przyszłość)
- `errors` — lista błędów (pusta tablica przy sukcesie)

### Przykład błędu

```json
{
  "data": null,
  "meta": {},
  "errors": [
    {
      "code": "GROUP_NOT_FOUND",
      "message": "Nie znaleziono grupy",
      "details": {
        "groupId": "group-1"
      }
    }
  ]
}
```

---

## Wspólne typy kontraktu

Bazowe typy odpowiedzi powinny być zdefiniowane raz i współdzielone przez wszystkie endpointy.

```ts
type ApiResponse<T> = {
  data: T;
  meta: Record<string, unknown>;
  errors: ApiError[];
};

type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

type Status = 'ACTIVE' | 'INACTIVE';
```

---

## 1. Pobranie listy grup z rolami

### Cel

Frontend potrzebuje wyświetlić listę grup wraz z przypisanymi rolami.

### Endpoint

```http
GET /api/abac/v1/groups
```

### Przykład odpowiedzi

```json
{
  "data": [
    {
      "id": "group-1",
      "name": "Administrators",
      "description": "Użytkownicy z pełnym dostępem administracyjnym",
      "status": "ACTIVE",
      "roles": [
        {
          "id": "role-1",
          "name": "READ_USERS",
          "description": "Może przeglądać użytkowników",
          "status": "ACTIVE"
        },
        {
          "id": "role-2",
          "name": "WRITE_USERS",
          "description": "Może edytować użytkowników",
          "status": "ACTIVE"
        }
      ]
    }
  ],
  "meta": {},
  "errors": []
}
```

### DTO

```ts
type GroupsResponse = ApiResponse<GroupWithRolesDto[]>;

type GroupWithRolesDto = {
  id: string;
  name: string;
  description?: string;
  status: Status;
  roles: RoleDto[];
};

type RoleDto = {
  id: string;
  name: string;
  description?: string;
  status: Status;
};
```

---

## 2. Pobranie użytkowników z grupami i rolami

### Cel

Frontend potrzebuje wyświetlić listę użytkowników wraz z przypisanymi grupami.
Role powinny być zagnieżdżone w grupach, ponieważ należą do grup.

### Endpoint

Jedna z poniższych nazw endpointu, do wyboru:

```http
GET /api/abac/v1/users/permissions
GET /api/abac/v1/users-access
```

### Przykład odpowiedzi

```json
{
  "data": [
    {
      "user": {
        "id": "user-1",
        "name": "John Smith",
        "email": "john.smith@example.com",
        "status": "ACTIVE"
      },
      "groups": [
        {
          "id": "group-1",
          "name": "Administrators",
          "description": "Użytkownicy z pełnym dostępem administracyjnym",
          "status": "ACTIVE",
          "roles": [
            {
              "id": "role-1",
              "name": "READ_USERS",
              "description": "Może przeglądać użytkowników",
              "status": "ACTIVE"
            }
          ]
        },
        {
          "id": "group-2",
          "name": "Auditors",
          "description": "Dostęp tylko do odczytu",
          "status": "ACTIVE",
          "roles": [
            {
              "id": "role-3",
              "name": "READ_AUDIT_LOGS",
              "description": "Może przeglądać logi audytowe",
              "status": "ACTIVE"
            }
          ]
        }
      ]
    }
  ],
  "meta": {},
  "errors": []
}
```

### DTO

```ts
type UsersAccessResponse = ApiResponse<UserAccessDto[]>;

type UserAccessDto = {
  user: UserDto;
  groups: GroupWithRolesDto[];
};

type UserDto = {
  id: string;
  name: string;
  email: string;
  status: Status;
};
```

---

## Zasady kontraktu

### 1. Wspólne typy odpowiedzi definiujemy raz

Typy takie jak `ApiResponse<T>` i `ApiError` są częścią wspólnego kontraktu API i nie powinny być powielane osobno w każdej sekcji endpointu.

### 2. API powinno zwracać DTO dostosowane do UI

Odpowiedź powinna być zaprojektowana pod use-case frontendu, a nie odzwierciedlać strukturę bazy danych.

Dobrze:

```json
{
  "id": "group-1",
  "name": "Administrators",
  "description": "Grupa administratorów"
}
```

Źle:

```json
{
  "entityId": "group-1",
  "typecode": "GROUP",
  "class": "SECURITY_OBJECT",
  "code": "ADM"
}
```

### 3. Unikanie N+1 zapytań

Frontend nie powinien wykonywać wielu zapytań, aby złożyć dane.
API powinno zwracać dane zagregowane w jednym response.

### 4. Czytelne nazewnictwo

Używaj nazw zrozumiałych dla konsumenta API:

- `id`
- `name`
- `description`
- `status`
- `user`
- `groups`
- `roles`

Unikaj nazw technicznych:

- `entityId`
- `typecode`
- `class`
- `objectCode`
- `securityObjectCode`

### 5. Brak paginacji

Zakładany rozmiar danych jest niewielki:

- około `100` użytkowników
- ograniczona liczba grup i ról

Dlatego paginacja nie jest wymagana.

```json
{
  "meta": {}
}
```

### 6. Typy union muszą mieć jawne definicje

Pola takie jak `status` nie powinny używać nieopisanych wartości tekstowych. Każdy typ union pełniący rolę enuma powinien mieć:

- centralną definicję typu
- pełną listę dozwolonych wartości
- opis znaczenia biznesowego każdej wartości

Przykład:

```ts
type Status = 'ACTIVE' | 'INACTIVE';
```

Znaczenie wartości powinno być opisane w kontrakcie, na przykład:

- `ACTIVE` — obiekt jest aktywny i może być używany w systemie
- `INACTIVE` — obiekt istnieje, ale nie powinien być używany operacyjnie

Ta sama zasada dotyczy wszystkich podobnych typów, nie tylko pola `status`.

### 7. Role wewnątrz grup

Struktura musi zachować hierarchię:

```text
user
└── groups[]
    └── roles[]
```

Nie:

```text
user
├── groups[]
└── roles[]
```

---

## Podsumowanie

Wymagane endpointy:

```http
GET /api/abac/v1/groups
```

Jeden z poniższych endpointów dla uprawnień użytkowników:

```http
GET /api/abac/v1/users/permissions
GET /api/abac/v1/users-access
```

Format odpowiedzi:

```json
{
  "data": [],
  "meta": {},
  "errors": []
}
```
