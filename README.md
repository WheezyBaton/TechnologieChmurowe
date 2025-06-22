# Projekt Technologie Chmurowe - Sebastian Błaszczyk

## Flow aplikacji

### 1. Użytkownik otwiera aplikację w przeglądarce

### 2. Frontend (React) ładuje interfejs użytkownika

### 3. Pobieranie danych:

- Frontend wysyła żądanie GET /api/items do backendu

              // Przykładowe żądanie
              fetch(`${API_URL}/items`)

### 4. Przetwarzanie w backendzie:

- Backend odbiera żądanie
- Łączy się z MongoDB za pomocą poświadczeń z Secretów

              // Połączenie z MongoDB
              mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)

### 5. Operacje bazodanowe:

- MongoDB zwraca 10 ostatnich pozycji

              // Zapytanie do bazy danych
              Item.find().sort({ createdAt: -1 }).limit(10)

- Odpowiedź do frontendu:
     - Backend zwraca dane w formacie JSON
     - Frontend renderuje listę elementów
- Dodawanie nowego elementu:

     - Użytkownik wypełnia formularz i klika "Add Item"
     - Frontend wysyła żądanie POST /api/items

                  // Przykładowy payload
                  {
                  name: "Przykład",
                  value: 42
                  }

     - Backend zapisuje dane w MongoDB
     - Nowy element pojawia się na liście bez przeładowania strony

### 6. Dodatkowe Funkcjonalności

- Bezpieczeństwo:
     - CORS z dynamiczną listą dozwolonych domen
     - Walidacja danych wejściowych
     - Sekrety dla poświadczeń bazy danych
- Monitorowanie:
     - Endpoint health check (/api/health)
     - Logowanie wszystkich żądań
     - Autoretry połączenia z bazą danych
- Skalowalność:
     - Horizontal Pod Autoscaler dla backendu
     - Wielokrotne repliki usług
     - LoadBalancer dla frontendu
- Trwałość danych:
     - Wolumeny Dockera dla MongoDB
     - Persistent Volume Claims w Kubernetes

### 7. Kluczowe Endpointy

| Endpoint    | Metoda | Opis                          |
| ----------- | ------ | ----------------------------- |
| /           | GET    | Interfejs użytkownika         |
| /api/health | GET    | Status usługi i połączenia DB |
| /api/items  | GET    | Pobierz listę elementów       |
| /api/items  | POST   | Dodaj nowy element            |

Aplikacja służy jako przykład implementacji pełnego stosu technologicznego w architekturze mikroserwisowej, demonstrując dobre praktyki w zakresie konteneryzacji, orkiestracji i zarządzania danymi.

## Instrukcja Uruchomienia Aplikacji Mikroserwisowej

Wymagania wstępne

- Docker Desktop:
- Konto Docker Hub:
- kubectl (instalowany automatycznie z Docker Desktop)

### Krok 1: Przygotowanie środowiska

- Sklonuj repozytorium (jeśli potrzebujesz):
- Zbuduj i opublikuj obrazy na Docker Hub:

#### Backend:

    cd backend

    docker buildx build --platform linux/amd64,linux/arm64 \
    -t twoj-login-dockerhub/microservices-backend:latest --push .

#### Frontend:

    cd ../frontend

    docker buildx build --platform linux/amd64,linux/arm64 \
    -t twoj-login-dockerhub/microservices-frontend:latest --push .

### Krok 2: Uruchomienie z Docker Compose

1.    Uruchom aplikację:

          docker-compose up --build

2.    Dostęp do aplikacji:

      Frontend: http://localhost:3000

      Backend API: http://localhost:5000/api/items

3.    Zatrzymanie aplikacji:

          docker-compose down -v

### Krok 3: Uruchomienie w Kubernetes (Docker Desktop)

1.    Włącz Kubernetes w Docker Desktop:

2.    Przygotuj manifesty:

      - Zaktualizuj nazwy obrazów w plikach:

           backend-deployment.yaml → twoj-login-dockerhub/microservices-backend:latest

           frontend-deployment.yaml → twoj-login-dockerhub/microservices-frontend:latest

3.    Zastosuj konfigurację Kubernetes:

          kubectl apply -f k8s/

4.    Sprawdź status wdrożenia:

          kubectl get all
          kubectl get ingress
          kubectl describe ingress app-ingress

5.    Dostęp do aplikacji:

http://localhost
