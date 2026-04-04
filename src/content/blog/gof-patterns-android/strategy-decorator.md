---
title: "Strategy & Decorator: A/B Tests at Runtime and Additive Layers"
description: "Strategy switches algorithms at runtime without touching business logic. Decorator wraps interfaces to add logging, auth, or caching one layer at a time. Together they make your app extensible without rewrites."
date: 2026-04-04
tags: ["android", "kotlin", "architecture", "design-patterns"]
authors: ["me"]
lang: en
order: 5
---

*Part 4 of [8 GoF Patterns That Decide If Your Android App Scales](./index)*

---

## Strategy — A/B Test at Runtime, Zero Rewrites

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. In Android: **business rules that change at runtime — pricing logic, recommendation algorithms, onboarding flows — are Strategies**. You swap the algorithm without touching the code that uses it.

### The Problem: Hardcoded Logic Branches

```kotlin
// Adding a variant means editing this class every time
class PricingEngine {

    fun calculatePrice(product: Product, userId: String): Double {
        return when {
            isUserInExperiment("premium_pricing", userId) -> product.price * 1.15
            isUserInExperiment("discount_pricing", userId) -> product.price * 0.90
            else -> product.price
        }
    }
}
```

Every new A/B test adds a branch here. After 5 experiments, this function is unreadable. After 10, it's a bug factory.

### Strategy: Encapsulate the Algorithm

```kotlin
// The strategy interface — one algorithm, one contract
fun interface PricingStrategy {
    fun calculate(product: Product, userId: String): Double
}
```

```kotlin
// Each variant is a self-contained strategy
object StandardPricing : PricingStrategy {
    override fun calculate(product: Product, userId: String) = product.price
}

object PremiumPricing : PricingStrategy {
    override fun calculate(product: Product, userId: String) = product.price * 1.15
}

object DiscountPricing : PricingStrategy {
    override fun calculate(product: Product, userId: String) = product.price * 0.90
}

class PersonalizedPricing(
    private val userRepo: UserRepository
) : PricingStrategy {
    override fun calculate(product: Product, userId: String): Double {
        val tier = userRepo.getUserTier(userId)
        return product.price * tier.multiplier
    }
}
```

```kotlin
// PricingEngine never changes — just inject the right strategy
class PricingEngine(private val strategy: PricingStrategy) {

    fun calculatePrice(product: Product, userId: String): Double =
        strategy.calculate(product, userId)
}
```

### Remote Config: Switch Strategies at Runtime

```kotlin
// Factory selects the active strategy based on remote config
class PricingStrategyFactory(
    private val remoteConfig: RemoteConfig,
    private val userRepo: UserRepository
) {
    fun get(userId: String): PricingStrategy =
        when (remoteConfig.getString("pricing_variant", "standard")) {
            "premium"      -> PremiumPricing
            "discount"     -> DiscountPricing
            "personalized" -> PersonalizedPricing(userRepo)
            else           -> StandardPricing
        }
}
```

```kotlin
// ViewModel wires it up
class ProductViewModel(
    private val productRepo: ProductRepository,
    private val pricingFactory: PricingStrategyFactory,
    private val userId: String
) : ViewModel() {

    fun loadProduct(id: String) {
        viewModelScope.launch {
            val product = productRepo.getProduct(id).getOrReturn { return@launch }
            val strategy = pricingFactory.get(userId)
            val price = strategy.calculate(product, userId)
            _uiState.value = ProductUiState.Content(product, price)
        }
    }
}
```

Push a remote config update → users get a different pricing algorithm on next app open. No release needed.

### Strategy for Sorting and Filtering

```kotlin
// Strategies compose cleanly with each other
fun interface SortStrategy<T> {
    fun sort(items: List<T>): List<T>
}

fun interface FilterStrategy<T> {
    fun filter(items: List<T>): List<T>
}

class ProductListProcessor<T>(
    private val sort: SortStrategy<T>,
    private val filter: FilterStrategy<T>
) {
    fun process(items: List<T>): List<T> = filter.filter(items).let(sort::sort)
}

// Usage
val processor = ProductListProcessor(
    sort   = SortStrategy { items -> items.sortedByDescending { (it as Product).rating } },
    filter = FilterStrategy { items -> items.filter { (it as Product).inStock } }
)
```

### Testing Strategies in Isolation

```kotlin
@Test
fun `premium pricing applies 15% markup`() {
    val product = Product(id = "p1", price = 100.0)
    val result = PremiumPricing.calculate(product, userId = "user_1")
    assertThat(result).isEqualTo(115.0)
}

@Test
fun `pricing engine delegates to injected strategy`() {
    val strategy = PricingStrategy { product, _ -> product.price * 2 }
    val engine = PricingEngine(strategy)
    val result = engine.calculatePrice(Product(id = "p1", price = 50.0), "user_1")
    assertThat(result).isEqualTo(100.0)
}
```

Each strategy is a pure function. Tests run in microseconds with no mocking.

---

## Decorator — Add Behaviors Without Touching Core

The Decorator pattern attaches additional responsibilities to an object dynamically. In Android: **cross-cutting concerns — logging, caching, auth headers, retry logic, analytics — are Decorators**. They wrap your interface, add one behavior, and delegate everything else.

### The Problem: Feature Creep in Core Classes

```kotlin
// Repository that "just needs" a few extras
class UserRepositoryImpl(private val api: UserApi) : UserRepository {

    override suspend fun getUser(id: String): Result<User> {
        Log.d("UserRepo", "getUser($id)")  // Logging concern
        val cached = cache[id]             // Caching concern
        if (cached != null) return Result.success(cached)

        return try {
            val user = api.getUser(id)
            cache[id] = user
            analyticsService.track("user_fetched") // Analytics concern
            Result.success(user)
        } catch (e: Exception) {
            Log.e("UserRepo", "Failed", e)
            Result.failure(e)
        }
    }
}
```

Three different concerns in one function. Add auth headers, add retry, add metrics — the class keeps growing. Testing any one concern means testing all of them.

### Decorator: One Wrapper, One Concern

```kotlin
// Core implementation — only fetches users
class UserRepositoryImpl(
    private val api: UserApi,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : UserRepository {

    override suspend fun getUser(id: String): Result<User> =
        withContext(dispatcher) { runCatching { api.getUser(id) } }

    override suspend fun saveUser(user: User): Result<Unit> =
        withContext(dispatcher) { runCatching { api.saveUser(user) } }
}
```

```kotlin
// Logging Decorator — adds structured logging
class LoggingUserRepository(
    private val delegate: UserRepository,
    private val tag: String = "UserRepository"
) : UserRepository {

    override suspend fun getUser(id: String): Result<User> {
        Log.d(tag, "getUser($id) →")
        return delegate.getUser(id).also { result ->
            result
                .onSuccess { Log.d(tag, "getUser($id) ← ${it.name}") }
                .onFailure { Log.e(tag, "getUser($id) ← ERROR", it) }
        }
    }

    override suspend fun saveUser(user: User) = delegate.saveUser(user)
}
```

```kotlin
// Caching Decorator — adds in-memory cache with TTL
class CachingUserRepository(
    private val delegate: UserRepository,
    private val ttlMs: Long = 300_000 // 5 minutes
) : UserRepository {

    private data class CacheEntry(val user: User, val expiresAt: Long)
    private val cache = ConcurrentHashMap<String, CacheEntry>()

    override suspend fun getUser(id: String): Result<User> {
        val entry = cache[id]
        if (entry != null && System.currentTimeMillis() < entry.expiresAt) {
            return Result.success(entry.user)
        }

        return delegate.getUser(id).also { result ->
            result.getOrNull()?.let {
                cache[id] = CacheEntry(it, System.currentTimeMillis() + ttlMs)
            }
        }
    }

    override suspend fun saveUser(user: User): Result<Unit> =
        delegate.saveUser(user).also { result ->
            result.getOrNull()?.let { cache.remove(user.id) }
        }
}
```

```kotlin
// Metrics Decorator — tracks call counts and latency
class MetricsUserRepository(
    private val delegate: UserRepository,
    private val metrics: MetricsService
) : UserRepository {

    override suspend fun getUser(id: String): Result<User> {
        val start = System.currentTimeMillis()
        return delegate.getUser(id).also { result ->
            val duration = System.currentTimeMillis() - start
            metrics.record("user_repo.get_user", duration,
                tags = mapOf("success" to result.isSuccess.toString()))
        }
    }

    override suspend fun saveUser(user: User) = delegate.saveUser(user)
}
```

### Composing Decorators

```kotlin
// Hilt wires the full decorator chain
@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideUserRepository(
        api: UserApi,
        metrics: MetricsService
    ): UserRepository =
        UserRepositoryImpl(api)
            .let { LoggingUserRepository(it) }
            .let { CachingUserRepository(it, ttlMs = 300_000) }
            .let { MetricsUserRepository(it, metrics) }
}
```

The order matters. In this chain:
1. `MetricsUserRepository` receives the call → starts timer
2. `CachingUserRepository` checks cache → cache miss → delegates
3. `LoggingUserRepository` logs the call → delegates
4. `UserRepositoryImpl` hits the network

Cache hit skips steps 3 and 4. Metrics always fires.

### Decorator for OkHttp Interceptors

The pattern is already baked into OkHttp — each `Interceptor` is a Decorator:

```kotlin
val client = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))      // Adds auth headers
    .addInterceptor(LoggingInterceptor())                // Logs request/response
    .addInterceptor(RetryInterceptor(maxRetries = 3))    // Retries on 5xx
    .addNetworkInterceptor(CacheInterceptor())           // Cache-Control headers
    .build()
```

Each interceptor wraps the `Chain` — the same pattern, applied to HTTP.

### Testing Each Decorator in Isolation

```kotlin
@Test
fun `caching repository returns cached value on second call`() = runTest {
    var callCount = 0
    val fakeDelegate = object : UserRepository {
        override suspend fun getUser(id: String): Result<User> {
            callCount++
            return Result.success(User(id, "Alice"))
        }
        override suspend fun saveUser(user: User) = Result.success(Unit)
    }

    val repo = CachingUserRepository(fakeDelegate, ttlMs = 60_000)

    repo.getUser("user_1")
    repo.getUser("user_1")

    assertThat(callCount).isEqualTo(1)  // Second call hit cache
}

@Test
fun `logging decorator logs on failure`() = runTest {
    val fakeDelegate = object : UserRepository {
        override suspend fun getUser(id: String) =
            Result.failure<User>(IOException("Network error"))
        override suspend fun saveUser(user: User) = Result.success(Unit)
    }

    // No assertions on Log — we're verifying it doesn't crash and propagates the failure
    val repo = LoggingUserRepository(fakeDelegate)
    val result = repo.getUser("user_1")
    assertThat(result.isFailure).isTrue()
}
```

---

## Strategy + Decorator in the Same Architecture

They solve different problems but compose naturally:

```
ViewModel
   │
   └── PricingEngine(strategy: PricingStrategy)     ← Strategy: which algorithm?
   │
   └── UserRepository (decorator chain)             ← Decorator: which concerns?
         ├── MetricsUserRepository
         ├── CachingUserRepository
         ├── LoggingUserRepository
         └── UserRepositoryImpl
```

**Strategy** answers: *which* algorithm runs?
**Decorator** answers: *what wraps around* the algorithm?

---

## Wrapping Up the Series

You now have the complete toolkit:

| Pattern | What it solves | Key insight |
|---|---|---|
| **Observer** | Stale UI | ViewModel emits state; Fragment/Composable reacts |
| **State** | Impossible UI states | Sealed class = compiler-enforced valid states |
| **Proxy** | Repeated network calls | Repository = transparent cache gate |
| **Facade** | Fat ViewModels | Feature API = one call hides N services |
| **Adapter** | SDK lock-in | Your interface, their implementation |
| **Factory** | Untestable classes | DI module = injectable fake or real |
| **Strategy** | Hardcoded algorithm branches | Inject the algorithm, swap at runtime |
| **Decorator** | Cross-cutting concerns bloating core | Wrap the interface, add one behavior |

The 4 rules from [Part 1](./index) hold across all 8:

```
→ Every SDK gets an Adapter
→ Repository always = Proxy (cache gate)
→ One sealed UiState per screen
→ Facade per feature — keep ViewModels thin
```

Add Strategy and Decorator and you have the full picture:

```
→ Every runtime-variable algorithm = Strategy
→ Every cross-cutting concern = Decorator
```

These aren't abstract. They're the decisions that make the difference between a codebase that scales and one that becomes a rewrite conversation.
