---
title: "Strategy & Decorator: A/B Tests en Runtime y Capas Aditivas"
description: "Strategy cambia algoritmos en runtime sin tocar la lógica de negocio. Decorator envuelve interfaces para agregar logging, auth o caché una capa a la vez. Juntos hacen tu app extensible sin reescrituras."
date: 2026-04-04
tags: ["android", "kotlin", "arquitectura", "patrones-de-diseño"]
authors: ["me"]
lang: es
order: 5
---

*Parte 4 de [8 Patrones GoF que Deciden si tu App Android Escala](./index)*

---

## Strategy — A/B Test en Runtime, Cero Reescrituras

El patrón Strategy define una familia de algoritmos, encapsula cada uno, y los hace intercambiables. En Android: **las reglas de negocio que cambian en runtime — lógica de precios, algoritmos de recomendación, flujos de onboarding — son Strategies**. Cambias el algoritmo sin tocar el código que lo usa.

### El Problema: Ramas de Lógica Hardcodeadas

```kotlin
// Agregar una variante significa editar esta clase cada vez
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

Cada nuevo A/B test agrega una rama aquí. Después de 5 experimentos, esta función es ilegible. Después de 10, es una fábrica de bugs.

### Strategy: Encapsula el Algoritmo

```kotlin
// La interfaz de strategy — un algoritmo, un contrato
fun interface PricingStrategy {
    fun calculate(product: Product, userId: String): Double
}
```

```kotlin
// Cada variante es una strategy autocontenida
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
// PricingEngine nunca cambia — solo inyecta la strategy correcta
class PricingEngine(private val strategy: PricingStrategy) {

    fun calculatePrice(product: Product, userId: String): Double =
        strategy.calculate(product, userId)
}
```

### Remote Config: Cambia Strategies en Runtime

```kotlin
// Factory selecciona la strategy activa según la config remota
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
// ViewModel lo conecta todo
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

Empuja una actualización de config remota → los usuarios obtienen un algoritmo de precios diferente en la próxima apertura de la app. Sin release necesario.

### Strategy para Ordenamiento y Filtrado

```kotlin
// Las strategies se componen entre sí limpiamente
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

// Uso
val processor = ProductListProcessor(
    sort   = SortStrategy { items -> items.sortedByDescending { (it as Product).rating } },
    filter = FilterStrategy { items -> items.filter { (it as Product).inStock } }
)
```

### Testeando Strategies de Forma Aislada

```kotlin
@Test
fun `premium pricing aplica markup del 15%`() {
    val product = Product(id = "p1", price = 100.0)
    val result = PremiumPricing.calculate(product, userId = "user_1")
    assertThat(result).isEqualTo(115.0)
}

@Test
fun `pricing engine delega a la strategy inyectada`() {
    val strategy = PricingStrategy { product, _ -> product.price * 2 }
    val engine = PricingEngine(strategy)
    val result = engine.calculatePrice(Product(id = "p1", price = 50.0), "user_1")
    assertThat(result).isEqualTo(100.0)
}
```

Cada strategy es una función pura. Los tests corren en microsegundos sin mocking.

---

## Decorator — Agrega Comportamientos Sin Tocar el Núcleo

El patrón Decorator adjunta responsabilidades adicionales a un objeto dinámicamente. En Android: **las preocupaciones transversales — logging, caché, encabezados de auth, lógica de retry, analíticas — son Decorators**. Envuelven tu interfaz, agregan un comportamiento, y delegan todo lo demás.

### El Problema: Feature Creep en Clases Núcleo

```kotlin
// Repository que "solo necesita" algunos extras
class UserRepositoryImpl(private val api: UserApi) : UserRepository {

    override suspend fun getUser(id: String): Result<User> {
        Log.d("UserRepo", "getUser($id)")  // Preocupación de logging
        val cached = cache[id]             // Preocupación de caché
        if (cached != null) return Result.success(cached)

        return try {
            val user = api.getUser(id)
            cache[id] = user
            analyticsService.track("user_fetched") // Preocupación de analíticas
            Result.success(user)
        } catch (e: Exception) {
            Log.e("UserRepo", "Failed", e)
            Result.failure(e)
        }
    }
}
```

Tres preocupaciones diferentes en una función. Agrega encabezados de auth, agrega retry, agrega métricas — la clase sigue creciendo. Testear cualquier preocupación significa testear todas.

### Decorator: Un Wrapper, Una Preocupación

```kotlin
// Implementación núcleo — solo obtiene usuarios
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
// Logging Decorator — agrega logging estructurado
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
// Caching Decorator — agrega caché en memoria con TTL
class CachingUserRepository(
    private val delegate: UserRepository,
    private val ttlMs: Long = 300_000 // 5 minutos
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
// Metrics Decorator — rastrea conteos de llamadas y latencia
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

### Componiendo Decorators

```kotlin
// Hilt conecta la cadena completa de decorators
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

El orden importa. En esta cadena:
1. `MetricsUserRepository` recibe la llamada → inicia el timer
2. `CachingUserRepository` verifica la caché → cache miss → delega
3. `LoggingUserRepository` loguea la llamada → delega
4. `UserRepositoryImpl` golpea la red

Un cache hit omite los pasos 3 y 4. Las métricas siempre se disparan.

### Decorator para Interceptores OkHttp

El patrón ya está integrado en OkHttp — cada `Interceptor` es un Decorator:

```kotlin
val client = OkHttpClient.Builder()
    .addInterceptor(AuthInterceptor(tokenProvider))      // Agrega headers de auth
    .addInterceptor(LoggingInterceptor())                // Loguea request/response
    .addInterceptor(RetryInterceptor(maxRetries = 3))    // Reintenta en 5xx
    .addNetworkInterceptor(CacheInterceptor())           // Headers Cache-Control
    .build()
```

Cada interceptor envuelve la `Chain` — el mismo patrón, aplicado a HTTP.

### Testeando Cada Decorator de Forma Aislada

```kotlin
@Test
fun `caching repository devuelve valor cacheado en segunda llamada`() = runTest {
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

    assertThat(callCount).isEqualTo(1)  // Segunda llamada usó la caché
}

@Test
fun `logging decorator loguea en fallo`() = runTest {
    val fakeDelegate = object : UserRepository {
        override suspend fun getUser(id: String) =
            Result.failure<User>(IOException("Error de red"))
        override suspend fun saveUser(user: User) = Result.success(Unit)
    }

    // Sin aserciones sobre Log — verificamos que no crashea y propaga el fallo
    val repo = LoggingUserRepository(fakeDelegate)
    val result = repo.getUser("user_1")
    assertThat(result.isFailure).isTrue()
}
```

---

## Strategy + Decorator en la Misma Arquitectura

Resuelven problemas diferentes pero se componen naturalmente:

```
ViewModel
   │
   └── PricingEngine(strategy: PricingStrategy)     ← Strategy: ¿qué algoritmo?
   │
   └── UserRepository (cadena de decorators)        ← Decorator: ¿qué envuelve al algoritmo?
         ├── MetricsUserRepository
         ├── CachingUserRepository
         ├── LoggingUserRepository
         └── UserRepositoryImpl
```

**Strategy** responde: ¿*cuál* algoritmo corre?
**Decorator** responde: ¿*qué envuelve* al algoritmo?

---

## Cerrando la Serie

Ahora tienes el toolkit completo:

| Patrón | Qué resuelve | Insight clave |
|---|---|---|
| **Observer** | UI desactualizada | ViewModel emite estado; Fragment/Composable reacciona |
| **State** | Estados imposibles de UI | Sealed class = estados válidos forzados por el compilador |
| **Proxy** | Llamadas repetidas a la red | Repository = cache gate transparente |
| **Facade** | ViewModels gordos | API de feature = una llamada oculta N servicios |
| **Adapter** | Lock-in de SDK | Tu interfaz, su implementación |
| **Factory** | Clases no testeables | Módulo DI = fake o real inyectable |
| **Strategy** | Ramas de algoritmo hardcodeadas | Inyecta el algoritmo, cambia en runtime |
| **Decorator** | Preocupaciones transversales en clases núcleo | Envuelve la interfaz, agrega un comportamiento |

Las 4 reglas de la [Parte 1](./index) se mantienen en los 8:

```
→ Cada SDK obtiene un Adapter
→ Repository siempre = Proxy (cache gate)
→ Un sealed UiState por pantalla
→ Facade por feature — ViewModels delgados
```

Agrega Strategy y Decorator y tienes el cuadro completo:

```
→ Cada algoritmo variable en runtime = Strategy
→ Cada preocupación transversal = Decorator
```

Estas no son abstracciones. Son las decisiones que marcan la diferencia entre un codebase que escala y uno que se convierte en una conversación de reescritura.
