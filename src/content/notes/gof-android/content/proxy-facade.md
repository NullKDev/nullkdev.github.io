---
parentDomain: notes
parentId: notes-gof-android
documentId: proxy-facade
locale: en
translationKey: gof-proxy-facade
slug: proxy-facade
title: 'Proxy & Facade: cache gates and thin ViewModels'
summary: Proxy adds caching and retry invisible to callers; Facade hides a multi-service flow behind a single call so ViewModels stay thin.
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

## Proxy — cache + retry, invisible to callers

The Proxy pattern provides a substitute for another object, controlling access to it. In Android: **your Repository is a Proxy**. The ViewModel asks for data; the Repository decides whether to return it from memory, disk, or the network.

The caller never knows which one.

### Without Proxy — ViewModels doing too much

```kotlin
// ViewModel shouldn't know about caching, retries, or network state
class UserProfileViewModel(private val api: UserApi) : ViewModel() {

    fun loadUser(id: String) {
        viewModelScope.launch {
            // Cache logic in ViewModel? Retry logic? No.
            if (memoryCache.contains(id)) {
                _uiState.value = UiState.Content(memoryCache[id]!!)
                return@launch
            }
            try {
                val user = api.getUser(id)
                memoryCache[id] = user
                _uiState.value = UiState.Content(user)
            } catch (e: Exception) {
                // Do we retry? How many times? The ViewModel shouldn't decide.
                _uiState.value = UiState.Error(e.message)
            }
        }
    }
}
```

This ViewModel knows about caching, retry policy, and network errors. Change any infrastructure detail and you edit business logic.

### Proxy: Repository as cache gate

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
            // 1. Memory hit — instant return
            cache.get(id)?.let { return@withContext Result.success(it) }

            // 2. Network with retry — caller never sees this
            retry(times = 3, delayMs = 1000) {
                api.getUser(id)
            }.also { result ->
                result.getOrNull()?.let { cache.put(id, it, ttlMs = 300_000) }
            }
        }
}
```

```kotlin
// Retry helper — pure function, easy to test
suspend fun <T> retry(
    times: Int,
    delayMs: Long = 500,
    block: suspend () -> T
): Result<T> {
    repeat(times - 1) { attempt ->
        runCatching { block() }
            .onSuccess { return Result.success(it) }
        delay(delayMs * (attempt + 1))  // Exponential backoff
    }
    return runCatching { block() }
}
```

```kotlin
// ViewModel is now clean
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

The ViewModel has no idea about cache, retry, or network state. Swap `UserRepositoryImpl` for an offline-first Room-backed version — the ViewModel changes nothing.

### Offline-first Proxy with Room + network

```kotlin
class UserRepositoryImpl(
    private val api: UserApi,
    private val dao: UserDao
) : UserRepository {

    override suspend fun getUser(id: String): Result<User> =
        withContext(Dispatchers.IO) {
            runCatching {
                // Try local DB first
                dao.getUser(id)?.let { return@runCatching it }

                // Hit network, persist result
                api.getUser(id).also { dao.upsert(it) }
            }
        }

    // Room Flow — auto-updates when DB changes
    fun observeUser(id: String): Flow<User?> = dao.observeUser(id)
}
```

---

## Facade — one call hides five use cases

The Facade pattern provides a simplified interface to a complex subsystem. In Android: **your feature API is a Facade**. The ViewModel calls one method; the Facade coordinates multiple services underneath.

### The problem: fat ViewModels

```kotlin
// ViewModel orchestrating everything — a common anti-pattern
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
            if (!reserved) { /* handle */ return@launch }
            val result = paymentService.charge(cart.total, userId)
            analyticsService.track("checkout_completed", mapOf("total" to cart.total))
            notificationService.sendConfirmation(userId)
            // ... and it keeps growing
        }
    }
}
```

This ViewModel has 5 dependencies and knows the entire checkout choreography. Every new business rule adds a line here.

### Facade: feature API

```kotlin
// The Facade — one interface, one responsibility
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
                "Items not available"
            }

            val receipt = paymentService.charge(cart.total, userId)

            // Fire-and-forget side effects
            coroutineScope {
                launch { analyticsService.track("checkout_completed", cart.toMap()) }
                launch { notificationService.sendConfirmation(userId, receipt) }
            }

            receipt
        }
}
```

```kotlin
// ViewModel has ONE dependency — stays thin
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

New business rule (loyalty points, fraud check, referral tracking)? Add it to `CheckoutFacadeImpl`. The ViewModel never changes.

### Testing the Facade

```kotlin
@Test
fun `checkout success updates state to Success`() = runTest {
    val fakeFacade = object : CheckoutFacade {
        override suspend fun checkout(userId: String) =
            Result.success(CheckoutReceipt(id = "receipt_123", total = 99.0))
    }

    val viewModel = CheckoutViewModel(checkout = fakeFacade)
    viewModel.checkout("user_1")

    assertThat(viewModel.uiState.value).isInstanceOf(CheckoutUiState.Success::class.java)
}
```

One-line fake, no mocking framework needed. That's the payoff.

---

## Proxy + Facade in the same architecture

```
ViewModel
   │
   └── CheckoutFacade          ← Facade: hides complexity
         │
         ├── CartRepository    ← Proxy: cache gate
         ├── PaymentService
         ├── InventoryService  ← Proxy: cache gate
         └── AnalyticsService
```

The ViewModel talks to the Facade. The Facade orchestrates Proxies. Neither layer knows the other's implementation details.

That keeps the layers honest on the inside. Keeping them honest at the boundary — swapping any SDK in a single file, building sources that are mockable from day one — is what the next pair is for.
