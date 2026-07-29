---
parentDomain: notes
parentId: notes-gof-android-es
documentId: proxy-facade
locale: es
translationKey: gof-proxy-facade
slug: proxy-facade
title: 'Proxy & Facade: cache gates y ViewModels delgados'
summary: Proxy agrega caché y reintentos invisibles para quien llama; Facade oculta un flujo de varios servicios detrás de una sola llamada para mantener delgados los ViewModels.
order: 2
visibility: public
maturity: stable
publishedAt: 2026-04-04
updatedAt: 2026-07-23
topics: [android, kotlin, architecture]
references: []
evidence: []
protection: { mode: public }
---

## Proxy — cache + retry, invisible para quien llama

El patrón Proxy provee un sustituto para otro objeto, controlando el acceso a él. En Android: **tu Repository es un Proxy**. El ViewModel pide datos; el Repository decide si devolverlos desde memoria, disco o la red.

Quien llama nunca lo sabe.

### Sin Proxy — ViewModels haciendo demasiado

```kotlin
// ViewModel no debería saber sobre caché, reintentos, ni estado de red
class UserProfileViewModel(private val api: UserApi) : ViewModel() {

    fun loadUser(id: String) {
        viewModelScope.launch {
            // ¿Lógica de caché en el ViewModel? ¿Lógica de retry? No.
            if (memoryCache.contains(id)) {
                _uiState.value = UiState.Content(memoryCache[id]!!)
                return@launch
            }
            try {
                val user = api.getUser(id)
                memoryCache[id] = user
                _uiState.value = UiState.Content(user)
            } catch (e: Exception) {
                // ¿Reintentamos? ¿Cuántas veces? El ViewModel no debería decidir.
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}
```

Este ViewModel conoce sobre caché, política de reintentos y errores de red. Cambia cualquier detalle de infraestructura y estarás editando lógica de negocio.

### Proxy: Repository como cache gate

```kotlin
interface UserRepository {
    suspend fun getUser(id: String): Result<User>
}
```

```kotlin
class UserRepositoryImpl(
    private val api: UserApi,
    private val cache: UserCache,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : UserRepository {

    override suspend fun getUser(id: String): Result<User> =
        withContext(dispatcher) {
            // 1. Cache hit — retorno instantáneo
            cache.get(id)?.let { return@withContext Result.success(it) }

            // 2. Red con retry — quien llama nunca ve esto
            retry(times = 3, delayMs = 1000) {
                api.getUser(id)
            }.also { result ->
                result.getOrNull()?.let { cache.put(id, it, ttlMs = 300_000) }
            }
        }
}
```

```kotlin
// Helper de retry — función pura, fácil de testear
suspend fun <T> retry(
    times: Int,
    delayMs: Long = 500,
    block: suspend () -> T
): Result<T> {
    repeat(times - 1) { attempt ->
        runCatching { block() }
            .onSuccess { return Result.success(it) }
        delay(delayMs * (attempt + 1))  // Backoff exponencial
    }
    return runCatching { block() }
}
```

```kotlin
// ViewModel ahora está limpio
class UserProfileViewModel(private val repo: UserRepository) : ViewModel() {

    fun loadUser(id: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            repo.getUser(id)
                .onSuccess { _uiState.value = UiState.Content(it) }
                .onFailure { _uiState.value = UiState.Error(it.message) }
        }
    }
}
```

El ViewModel no tiene idea de caché, reintentos ni estado de red. Cambia `UserRepositoryImpl` por una versión offline-first respaldada por Room — el ViewModel no cambia nada.

### Proxy offline-first con Room + red

```kotlin
class UserRepositoryImpl(
    private val api: UserApi,
    private val dao: UserDao
) : UserRepository {

    override suspend fun getUser(id: String): Result<User> =
        withContext(Dispatchers.IO) {
            runCatching {
                // Primero intenta BD local
                dao.getUser(id)?.let { return@runCatching it }

                // Golpea la red, persiste el resultado
                api.getUser(id).also { dao.upsert(it) }
            }
        }

    // Room Flow — se actualiza automáticamente cuando cambia la BD
    fun observeUser(id: String): Flow<User?> = dao.observeUser(id)
}
```

---

## Facade — una llamada oculta cinco casos de uso

El patrón Facade provee una interfaz simplificada a un subsistema complejo. En Android: **tu API de feature es una Facade**. El ViewModel llama un método; la Facade coordina múltiples servicios por debajo.

### El problema: ViewModels gordos

```kotlin
// ViewModel orquestando todo — un anti-patrón común
class CheckoutViewModel(
    private val cartRepo: CartRepository,
    private val paymentService: PaymentService,
    private val inventoryService: InventoryService,
    private val analyticsService: AnalyticsService,
    private val notificationService: NotificationService
) : ViewModel() {

    fun checkout(userId: String) {
        viewModelScope.launch {
            val cart = cartRepo.getCart(userId)
            val reserved = inventoryService.reserve(cart.items)
            if (!reserved) { /* manejar */ return@launch }
            val result = paymentService.charge(cart.total, userId)
            analyticsService.track("checkout_completed", mapOf("total" to cart.total))
            notificationService.sendConfirmation(userId)
            // ... y sigue creciendo
        }
    }
}
```

Este ViewModel tiene 5 dependencias y conoce toda la coreografía del checkout. Cada nueva regla de negocio agrega una línea aquí.

### Facade: API de feature

```kotlin
// La Facade — una interfaz, una responsabilidad
interface CheckoutFacade {
    suspend fun checkout(userId: String): Result<CheckoutReceipt>
}
```

```kotlin
class CheckoutFacadeImpl(
    private val cartRepo: CartRepository,
    private val paymentService: PaymentService,
    private val inventoryService: InventoryService,
    private val analyticsService: AnalyticsService,
    private val notificationService: NotificationService
) : CheckoutFacade {

    override suspend fun checkout(userId: String): Result<CheckoutReceipt> =
        runCatching {
            val cart = cartRepo.getCart(userId)

            check(inventoryService.reserve(cart.items)) {
                "Productos no disponibles"
            }

            val receipt = paymentService.charge(cart.total, userId)

            // Efectos secundarios fire-and-forget
            coroutineScope {
                launch { analyticsService.track("checkout_completed", cart.toMap()) }
                launch { notificationService.sendConfirmation(userId, receipt) }
            }

            receipt
        }
}
```

```kotlin
// ViewModel tiene UNA dependencia — se mantiene delgado
class CheckoutViewModel(private val checkout: CheckoutFacade) : ViewModel() {

    fun checkout(userId: String) {
        viewModelScope.launch {
            _uiState.value = CheckoutUiState.Processing
            checkout.checkout(userId)
                .onSuccess { _uiState.value = CheckoutUiState.Success(it) }
                .onFailure { _uiState.value = CheckoutUiState.Error(it.message) }
        }
    }
}
```

¿Nueva regla de negocio (puntos de fidelidad, verificación de fraude, tracking de referidos)? Agrégala a `CheckoutFacadeImpl`. El ViewModel nunca cambia.

### Testeando la Facade

```kotlin
@Test
fun `checkout exitoso actualiza estado a Success`() = runTest {
    val fakeFacade = object : CheckoutFacade {
        override suspend fun checkout(userId: String) =
            Result.success(CheckoutReceipt(id = "receipt_123", total = 99.0))
    }

    val viewModel = CheckoutViewModel(checkout = fakeFacade)
    viewModel.checkout("user_1")

    assertThat(viewModel.uiState.value).isInstanceOf(CheckoutUiState.Success::class.java)
}
```

Fake de una línea, sin framework de mocking. Ese es el beneficio.

---

## Proxy + Facade en la misma arquitectura

```
ViewModel
   │
   └── CheckoutFacade          ← Facade: oculta complejidad
         │
         ├── CartRepository    ← Proxy: cache gate
         ├── PaymentService
         ├── InventoryService  ← Proxy: cache gate
         └── AnalyticsService
```

El ViewModel habla con la Facade. La Facade orquesta Proxies. Ninguna capa conoce los detalles de implementación de la otra.

Eso mantiene honestas a las capas por dentro. Mantenerlas honestas en el borde — cambiar cualquier SDK en un solo archivo, construir fuentes mockeables desde el día uno — es para lo que sirve el siguiente par.
