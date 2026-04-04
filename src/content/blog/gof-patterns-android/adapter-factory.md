---
title: "Adapter & Factory: Zero SDK Lock-in and 10× Faster Tests"
description: "Adapter wraps any third-party SDK behind your own interface. Factory creates those implementations in a way that's mockable from day one. The result: swap SDKs in one file, run tests without a real network."
date: 2026-04-04
tags: ["android", "kotlin", "architecture", "design-patterns"]
authors: ["me"]
lang: en
order: 4
---

*Part 4 of [8 GoF Patterns That Decide If Your Android App Scales](./index)*

---

## Adapter — Swap Any SDK in One File

The Adapter pattern converts the interface of a class into another interface that clients expect. In Android: **every third-party SDK gets wrapped in your own interface**. Your business logic depends on your interface. The Adapter connects your interface to the SDK.

When the SDK changes — pricing, API, deprecation — you change one file.

### The Problem: Direct SDK Dependency

```kotlin
// Business logic coupled directly to Firebase
class EventTracker(private val firebase: FirebaseAnalytics) {

    fun trackPurchase(productId: String, price: Double) {
        val bundle = Bundle().apply {
            putString("product_id", productId)
            putDouble("price", price)
        }
        firebase.logEvent("purchase", bundle)
    }
}
```

Now your product manager wants to A/B test Firebase vs Amplitude. Or the SDK raises prices. Or you want to test `EventTracker` without spinning up Firebase. None of this is easy with a direct dependency.

### Adapter: Your Interface, Their Implementation

```kotlin
// Step 1: Define YOUR interface — the contract your code depends on
interface AnalyticsTracker {
    fun track(event: String, params: Map<String, Any> = emptyMap())
    fun setUserId(id: String)
    fun reset()
}
```

```kotlin
// Step 2: Firebase Adapter — wraps the SDK
class FirebaseAnalyticsAdapter(
    private val firebase: FirebaseAnalytics
) : AnalyticsTracker {

    override fun track(event: String, params: Map<String, Any>) {
        val bundle = Bundle().apply {
            params.forEach { (k, v) -> putString(k, v.toString()) }
        }
        firebase.logEvent(event, bundle)
    }

    override fun setUserId(id: String) = firebase.setUserId(id)
    override fun reset() = firebase.setUserId(null)
}
```

```kotlin
// Step 3: Amplitude Adapter — same interface, different SDK
class AmplitudeAdapter(
    private val amplitude: Amplitude
) : AnalyticsTracker {

    override fun track(event: String, params: Map<String, Any>) {
        amplitude.track(event, params)
    }

    override fun setUserId(id: String) = amplitude.setUserId(id)
    override fun reset() = amplitude.reset()
}
```

```kotlin
// Business logic never changes — just inject the right adapter
class PurchaseUseCase(private val tracker: AnalyticsTracker) {

    suspend fun purchase(item: CartItem, userId: String): Result<Receipt> {
        // ... payment logic ...
        tracker.track("purchase", mapOf(
            "product_id" to item.id,
            "price" to item.price
        ))
        return Result.success(receipt)
    }
}
```

Swap SDKs by changing the injected adapter. The `PurchaseUseCase` has no idea which analytics SDK runs underneath.

### Multi-Destination Adapter

```kotlin
// Send events to multiple SDKs simultaneously
class CompositeAnalyticsTracker(
    private val trackers: List<AnalyticsTracker>
) : AnalyticsTracker {

    override fun track(event: String, params: Map<String, Any>) {
        trackers.forEach { it.track(event, params) }
    }

    override fun setUserId(id: String) = trackers.forEach { it.setUserId(id) }
    override fun reset() = trackers.forEach { it.reset() }
}

// Usage
val tracker = CompositeAnalyticsTracker(listOf(
    FirebaseAnalyticsAdapter(firebase),
    AmplitudeAdapter(amplitude),
))
```

### Testing With a Fake Adapter

```kotlin
class FakeAnalyticsTracker : AnalyticsTracker {
    val events = mutableListOf<Pair<String, Map<String, Any>>>()

    override fun track(event: String, params: Map<String, Any>) {
        events += event to params
    }

    override fun setUserId(id: String) {}
    override fun reset() { events.clear() }
}

@Test
fun `purchase tracks analytics event`() = runTest {
    val fakeTracker = FakeAnalyticsTracker()
    val useCase = PurchaseUseCase(tracker = fakeTracker)

    useCase.purchase(CartItem(id = "item_1", price = 29.99), userId = "user_1")

    assertThat(fakeTracker.events).hasSize(1)
    assertThat(fakeTracker.events.first().first).isEqualTo("purchase")
}
```

No Firebase instance. No Android context. Test runs in milliseconds.

---

## Factory — Mockable Sources from Day One

The Factory pattern defines an interface for creating objects, letting subclasses or callers decide which class to instantiate. In Android: **Factories create your Repository and service implementations**, making them swappable between production and test environments.

### The Problem: Hard-Coded Dependencies

```kotlin
// Impossible to test — real network, real database
class UserViewModel : ViewModel() {
    // Construction happens inside the class — no way to inject fakes
    private val api = RetrofitFactory.create(UserApi::class.java)
    private val dao = AppDatabase.getInstance(context).userDao()
    private val repo = UserRepositoryImpl(api, dao)
}
```

You can't run a unit test for this ViewModel without a real database and a real server.

### Factory: Separate Creation from Use

```kotlin
// The interface — what callers depend on
interface UserRepository {
    suspend fun getUser(id: String): Result<User>
    suspend fun saveUser(user: User): Result<Unit>
    fun observeUser(id: String): Flow<User?>
}
```

```kotlin
// Production implementation
class UserRepositoryImpl(
    private val api: UserApi,
    private val dao: UserDao,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : UserRepository {
    override suspend fun getUser(id: String) = withContext(dispatcher) {
        runCatching { dao.getUser(id) ?: api.getUser(id).also { dao.upsert(it) } }
    }
    override suspend fun saveUser(user: User) = withContext(dispatcher) {
        runCatching { dao.upsert(user) }
    }
    override fun observeUser(id: String): Flow<User?> = dao.observeUser(id)
}
```

```kotlin
// Test fake — in-memory, instant, deterministic
class FakeUserRepository : UserRepository {
    private val store = mutableMapOf<String, User>()
    private val updates = MutableStateFlow<User?>(null)

    fun seed(user: User) {
        store[user.id] = user
        updates.value = user
    }

    override suspend fun getUser(id: String) =
        store[id]?.let { Result.success(it) } ?: Result.failure(NoSuchElementException(id))

    override suspend fun saveUser(user: User): Result<Unit> {
        store[user.id] = user
        updates.value = user
        return Result.success(Unit)
    }

    override fun observeUser(id: String): Flow<User?> =
        updates.filterNotNull().filter { it.id == id }
}
```

```kotlin
// Hilt module wires the right implementation per environment
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}

// Test module overrides it
@TestInstallIn(
    components = [SingletonComponent::class],
    replaces = [RepositoryModule::class]
)
@Module
abstract class FakeRepositoryModule {

    @Binds
    @Singleton
    abstract fun bindUserRepository(fake: FakeUserRepository): UserRepository
}
```

### Inline Factory Pattern (No DI Framework)

```kotlin
// Simple factory when Hilt is overkill
object RepositoryFactory {

    fun createUserRepository(context: Context): UserRepository =
        if (BuildConfig.DEBUG && isRunningTests()) {
            FakeUserRepository()
        } else {
            UserRepositoryImpl(
                api = RetrofitFactory.create(UserApi::class.java),
                dao = AppDatabase.getInstance(context).userDao()
            )
        }
}
```

---

## Adapter + Factory in Practice

```kotlin
// Factory creates the right adapter for the environment
object AnalyticsFactory {

    fun create(context: Context): AnalyticsTracker =
        when {
            BuildConfig.DEBUG -> NoOpAnalyticsTracker()  // No events in debug
            isQABuild()       -> LoggingAnalyticsTracker() // Logs to console
            else -> CompositeAnalyticsTracker(listOf(
                FirebaseAnalyticsAdapter(FirebaseAnalytics.getInstance(context)),
                AmplitudeAdapter(Amplitude.getInstance().also {
                    it.initialize(context, BuildConfig.AMPLITUDE_KEY)
                })
            ))
        }
}
```

The Factory decides *which* Adapter to create. The Adapter decides *how* to call the SDK. Your business logic never touches either decision.

---

## The 10× Test Speed Claim

It's conservative. A ViewModel test with:
- Real Retrofit: **~3-8 seconds** (network timeout, response parsing)
- Fake Repository: **~30-80ms** (in-memory map lookup)

On a codebase with 200 ViewModel tests, that's the difference between a 30-minute CI run and a 3-minute CI run.

---

## Next Up

[Part 5: Strategy & Decorator →](./strategy-decorator) — how to A/B test at runtime without rewrites, and how to extend behavior without ever touching core logic.
