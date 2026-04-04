---
title: "Adapter & Factory: Cero Lock-in de SDK y Tests 10× Más Rápidos"
description: "Adapter envuelve cualquier SDK de terceros detrás de tu propia interfaz. Factory crea esas implementaciones de forma mockeable desde el día uno. El resultado: cambia SDKs en un archivo, ejecuta tests sin red real."
date: 2026-04-04
tags: ["android", "kotlin", "arquitectura", "patrones-de-diseño"]
authors: ["me"]
lang: es
order: 4
---

*Parte 4 de [8 Patrones GoF que Deciden si tu App Android Escala](./index)*

---

## Adapter — Cambia Cualquier SDK en un Archivo

El patrón Adapter convierte la interfaz de una clase en otra interfaz que los clientes esperan. En Android: **cada SDK de terceros se envuelve detrás de tu propia interfaz**. Tu lógica de negocio depende de tu interfaz. El Adapter conecta tu interfaz con el SDK.

Cuando el SDK cambia — precio, API, deprecación — cambias un archivo.

### El Problema: Dependencia Directa del SDK

```kotlin
// Lógica de negocio acoplada directamente a Firebase
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

Ahora tu product manager quiere hacer A/B test entre Firebase y Amplitude. O el SDK sube los precios. O quieres testear `EventTracker` sin iniciar Firebase. Nada de esto es fácil con una dependencia directa.

### Adapter: Tu Interfaz, Su Implementación

```kotlin
// Paso 1: Define TU interfaz — el contrato del que depende tu código
interface AnalyticsTracker {
    fun track(event: String, params: Map<String, Any> = emptyMap())
    fun setUserId(id: String)
    fun reset()
}
```

```kotlin
// Paso 2: Firebase Adapter — envuelve el SDK
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
// Paso 3: Amplitude Adapter — misma interfaz, SDK diferente
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
// La lógica de negocio nunca cambia — solo inyecta el adapter correcto
class PurchaseUseCase(private val tracker: AnalyticsTracker) {

    suspend fun purchase(item: CartItem, userId: String): Result<Receipt> {
        // ... lógica de pago ...
        tracker.track("purchase", mapOf(
            "product_id" to item.id,
            "price" to item.price
        ))
        return Result.success(receipt)
    }
}
```

Cambia SDKs cambiando el adapter inyectado. `PurchaseUseCase` no sabe qué SDK de analíticas corre por debajo.

### Adapter Multi-Destino

```kotlin
// Envía eventos a múltiples SDKs simultáneamente
class CompositeAnalyticsTracker(
    private val trackers: List<AnalyticsTracker>
) : AnalyticsTracker {

    override fun track(event: String, params: Map<String, Any>) {
        trackers.forEach { it.track(event, params) }
    }

    override fun setUserId(id: String) = trackers.forEach { it.setUserId(id) }
    override fun reset() = trackers.forEach { it.reset() }
}

// Uso
val tracker = CompositeAnalyticsTracker(listOf(
    FirebaseAnalyticsAdapter(firebase),
    AmplitudeAdapter(amplitude),
))
```

### Testeando con un Fake Adapter

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
fun `purchase registra evento de analíticas`() = runTest {
    val fakeTracker = FakeAnalyticsTracker()
    val useCase = PurchaseUseCase(tracker = fakeTracker)

    useCase.purchase(CartItem(id = "item_1", price = 29.99), userId = "user_1")

    assertThat(fakeTracker.events).hasSize(1)
    assertThat(fakeTracker.events.first().first).isEqualTo("purchase")
}
```

Sin instancia de Firebase. Sin contexto Android. El test corre en milisegundos.

---

## Factory — Fuentes Mockeables desde el Día Uno

El patrón Factory define una interfaz para crear objetos, dejando que las subclases o quien llama decida qué clase instanciar. En Android: **las Factories crean tus implementaciones de Repository y servicio**, haciéndolas intercambiables entre entornos de producción y test.

### El Problema: Dependencias Hardcodeadas

```kotlin
// Imposible de testear — red real, base de datos real
class UserViewModel : ViewModel() {
    // La construcción ocurre dentro de la clase — no hay forma de inyectar fakes
    private val api = RetrofitFactory.create(UserApi::class.java)
    private val dao = AppDatabase.getInstance(context).userDao()
    private val repo = UserRepositoryImpl(api, dao)
}
```

No puedes ejecutar un test unitario para este ViewModel sin una base de datos real y un servidor real.

### Factory: Separa la Creación del Uso

```kotlin
// La interfaz — de lo que dependen quienes llaman
interface UserRepository {
    suspend fun getUser(id: String): Result<User>
    suspend fun saveUser(user: User): Result<Unit>
    fun observeUser(id: String): Flow<User?>
}
```

```kotlin
// Implementación de producción
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
// Fake para tests — en memoria, instantáneo, determinístico
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
// Módulo Hilt conecta la implementación correcta por entorno
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}

// Módulo de test lo sobreescribe
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

### Patrón Factory Inline (Sin Framework de DI)

```kotlin
// Factory simple cuando Hilt es exagerado
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

## Adapter + Factory en la Práctica

```kotlin
// Factory crea el Adapter correcto para el entorno
object AnalyticsFactory {

    fun create(context: Context): AnalyticsTracker =
        when {
            BuildConfig.DEBUG -> NoOpAnalyticsTracker()     // Sin eventos en debug
            isQABuild()       -> LoggingAnalyticsTracker()  // Loguea en consola
            else -> CompositeAnalyticsTracker(listOf(
                FirebaseAnalyticsAdapter(FirebaseAnalytics.getInstance(context)),
                AmplitudeAdapter(Amplitude.getInstance().also {
                    it.initialize(context, BuildConfig.AMPLITUDE_KEY)
                })
            ))
        }
}
```

La Factory decide *cuál* Adapter crear. El Adapter decide *cómo* llamar al SDK. Tu lógica de negocio nunca toca ninguna de las dos decisiones.

---

## La Afirmación de Tests 10× Más Rápidos

Es conservadora. Un test de ViewModel con:
- Retrofit real: **~3-8 segundos** (timeout de red, parseo de respuesta)
- Repository fake: **~30-80ms** (búsqueda en mapa en memoria)

En un codebase con 200 tests de ViewModel, esa es la diferencia entre una CI de 30 minutos y una de 3 minutos.

---

## Siguiente

[Parte 5: Strategy & Decorator →](./strategy-decorator) — cómo hacer A/B test en runtime sin reescrituras, y cómo extender comportamiento sin tocar jamás la lógica núcleo.
