---
title: "Observer & State: UI que Nunca Miente"
description: "Observer mantiene tu UI sincronizada con los datos automáticamente. State elimina estados imposibles de UI en tiempo de compilación. Juntos, son la base de pantallas predecibles en Android."
date: 2026-04-04
tags: ["android", "kotlin", "arquitectura", "patrones-de-diseño"]
authors: ["me"]
lang: es
order: 2
---

*Parte 2 de [8 Patrones GoF que Deciden si tu App Android Escala](./index)*

---

## Observer — UI que Nunca Queda Desactualizada

El patrón Observer define una dependencia uno-a-muchos: cuando un objeto (el *sujeto*) cambia de estado, todos sus *observadores* son notificados automáticamente.

En Android esto antes significaba llamar manualmente `notifyDataSetChanged()`, alternar visibilidad en callbacks, y debuggear por qué la UI mostraba datos viejos después de una rotación. StateFlow resolvió todo eso.

### El Problema Sin Observer

```kotlin
// Enfoque viejo — sincronización manual, garantizada a desviarse
class LoginActivity : AppCompatActivity() {

    private fun doLogin() {
        showLoading()
        api.login(email, password) { result ->
            hideLoading()
            if (result.isSuccess) {
                navigateToHome()
            } else {
                showError(result.error)
                // ¿Ocultamos el loading? ¿Reactivamos el botón?
                // ¿Y la rotación? ¿Los cambios de configuración? 🤯
            }
        }
    }
}
```

Cada callback agrega una nueva rama. La rotación destruye la Activity a mitad del vuelo. Los estados de error se olvidan.

### Observer con StateFlow

```kotlin
// ViewModel es el sujeto — emite cambios de estado
class LoginViewModel(
    private val authRepo: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<LoginUiState>(LoginUiState.Idle)
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = LoginUiState.Loading
            authRepo.login(email, password)
                .onSuccess { _uiState.value = LoginUiState.Success(it) }
                .onFailure { _uiState.value = LoginUiState.Error(it.message) }
        }
    }
}
```

```kotlin
// Fragment es el observador — reacciona a cada emisión
lifecycleScope.launch {
    repeatOnLifecycle(Lifecycle.State.STARTED) {
        viewModel.uiState.collect { state ->
            when (state) {
                is LoginUiState.Idle    -> showForm()
                is LoginUiState.Loading -> showLoader()
                is LoginUiState.Success -> navigateToHome(state.user)
                is LoginUiState.Error   -> showError(state.message)
            }
        }
    }
}
```

El Fragment nunca llama a la API. El ViewModel nunca toca las Views. Rotación, back stack, muerte del proceso — todo manejado por el collector lifecycle-aware.

### Con Jetpack Compose

```kotlin
@Composable
fun LoginScreen(viewModel: LoginViewModel = viewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    when (state) {
        is LoginUiState.Idle    -> LoginForm(onLogin = viewModel::login)
        is LoginUiState.Loading -> CircularProgressIndicator()
        is LoginUiState.Success -> LaunchedEffect(Unit) { onNavigateHome() }
        is LoginUiState.Error   -> ErrorSnackbar(state.message)
    }
}
```

Una expresión `when`. Cero alternancia manual de Views.

---

## State — El Compilador como Tu Red de Seguridad

El patrón State permite que un objeto altere su comportamiento cuando su estado interno cambia. En términos Android: cada pantalla tiene un conjunto finito de estados, y debes hacer que los *estados imposibles sean imposibles* a nivel de tipos.

### El Problema: Sopa de Booleanos

```kotlin
// ¿Cuáles combinaciones son válidas? Nadie lo sabe.
class LoginViewModel : ViewModel() {
    val isLoading = MutableLiveData<Boolean>()
    val isError = MutableLiveData<Boolean>()
    val errorMessage = MutableLiveData<String?>()
    val isSuccess = MutableLiveData<Boolean>()
    val user = MutableLiveData<User?>()

    // ¿Pueden isLoading e isError ser true al mismo tiempo? ¿Puede isSuccess ser true con un user null?
    // El compilador no tiene idea. Los crashes en runtime te lo harán saber.
}
```

Con 4 booleanos tienes 16 combinaciones teóricas. Quizás 3 son válidas. El compilador no te dirá cuáles.

### Sealed Class UiState

```kotlin
// Cada estado válido es un tipo. Cada estado inválido es imposible.
sealed class LoginUiState {
    object Idle    : LoginUiState()
    object Loading : LoginUiState()
    data class Success(val user: User)      : LoginUiState()
    data class Error(val message: String?)  : LoginUiState()
}
```

**Por qué importa:**

```kotlin
// El compilador fuerza el manejo exhaustivo
when (state) {
    LoginUiState.Idle    -> ...
    LoginUiState.Loading -> ...
    is LoginUiState.Success -> ...  // El compilador sabe que state.user no es null
    is LoginUiState.Error   -> ...  // El compilador sabe que state.message existe
    // Olvidar una rama → error de compilación, no un crash en runtime
}
```

No puedes acceder a `state.user` cuando el estado es `Loading`. No puedes tener un `Success` con un user null. El sistema de tipos previene el bug antes de que el test siquiera se ejecute.

### Ejemplo Real de UiState

```kotlin
sealed class ProductDetailUiState {
    object Loading : ProductDetailUiState()

    data class Content(
        val product: Product,
        val relatedProducts: List<Product>,
        val isFavorite: Boolean,
        val stockStatus: StockStatus
    ) : ProductDetailUiState()

    data class Error(
        val message: String,
        val canRetry: Boolean
    ) : ProductDetailUiState()

    // Agrega estados a medida que la pantalla crece — los bloques when() existentes
    // producirán errores de compilación si olvidas manejar el nuevo estado
    object OutOfRegion : ProductDetailUiState()
}
```

Un sealed class por pantalla. Un `collect` en el Fragment o un `when` en el composable.

---

## Observer + State Juntos

El poder real viene de combinarlos:

```kotlin
// ViewModel combina ambos patrones
val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()  // Observer
//                     ^^^^^^^^^^^^^
//                     Sealed class fuerza estados válidos        // State
```

Observer asegura que la UI siempre refleje el último estado. State asegura que ese último estado siempre sea válido.

Resultado: **UI que nunca miente.**

---

## Siguiente

[Parte 3: Proxy & Facade →](./proxy-facade) — cómo construir un cache gate invisible para quien llama, y cómo mantener tus ViewModels delgados.
