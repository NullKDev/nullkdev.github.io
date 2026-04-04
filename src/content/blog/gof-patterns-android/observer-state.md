---
title: "Observer & State: UI That Never Lies"
description: "Observer keeps your UI in sync with data automatically. State eliminates impossible UI states at compile time. Together, they're the foundation of predictable screens in Android."
date: 2026-04-04
tags: ["android", "kotlin", "architecture", "design-patterns"]
authors: ["me"]
lang: en
order: 2
---

*Part 2 of [8 GoF Patterns That Decide If Your Android App Scales](./index)*

---

## Observer — UI That Never Goes Stale

The Observer pattern defines a one-to-many dependency: when one object (the *subject*) changes state, all its *observers* are notified automatically.

In Android this used to mean manually calling `notifyDataSetChanged()`, toggling visibility in callbacks, and debugging why the UI showed old data after a rotation. StateFlow fixed all of that.

### The Problem Without Observer

```kotlin
// Old approach — manual sync, guaranteed to drift
class LoginActivity : AppCompatActivity() {

    private fun doLogin() {
        showLoading()
        api.login(email, password) { result ->
            hideLoading()
            if (result.isSuccess) {
                navigateToHome()
            } else {
                showError(result.error)
                // Did we hide loading? Did we re-enable the button?
                // What about rotation? Config changes? 🤯
            }
        }
    }
}
```

Each callback adds a new branch. Rotation destroys the Activity mid-flight. Error states get forgotten.

### Observer with StateFlow

```kotlin
// ViewModel is the subject — emits state changes
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
// Fragment is the observer — reacts to every emission
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

The Fragment never calls the API. The ViewModel never touches Views. Rotation, back stack, process death — all handled by the lifecycle-aware collector.

### With Jetpack Compose

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

One `when` expression. Zero manual View toggling.

---

## State — The Compiler as Your Safety Net

The State pattern allows an object to alter its behaviour when its internal state changes. In Android terms: every screen has a finite set of states, and you should make *impossible states impossible* at the type level.

### The Problem: Boolean Soup

```kotlin
// Which combinations are valid? Nobody knows.
class LoginViewModel : ViewModel() {
    val isLoading = MutableLiveData<Boolean>()
    val isError = MutableLiveData<Boolean>()
    val errorMessage = MutableLiveData<String?>()
    val isSuccess = MutableLiveData<Boolean>()
    val user = MutableLiveData<User?>()

    // Can isLoading and isError both be true? Can isSuccess be true with a null user?
    // The compiler has no idea. Runtime crashes will find out for you.
}
```

With 4 booleans you have 16 theoretical combinations. Maybe 3 are valid. The compiler won't tell you.

### Sealed Class UiState

```kotlin
// Every valid state is a type. Every invalid state is impossible.
sealed class LoginUiState {
    object Idle    : LoginUiState()
    object Loading : LoginUiState()
    data class Success(val user: User)      : LoginUiState()
    data class Error(val message: String?)  : LoginUiState()
}
```

**Why this matters:**

```kotlin
// The compiler enforces exhaustive handling
when (state) {
    LoginUiState.Idle    -> ...
    LoginUiState.Loading -> ...
    is LoginUiState.Success -> ...  // Compiler knows state.user is non-null
    is LoginUiState.Error   -> ...  // Compiler knows state.message exists
    // Forget a branch → compile error, not a runtime crash
}
```

You cannot access `state.user` when the state is `Loading`. You cannot have a `Success` with a null user. The type system prevents the bug before the test ever runs.

### Real-World UiState Example

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

    // Add states as the screen grows — existing when() blocks will
    // produce compile errors if you forget to handle the new state
    object OutOfRegion : ProductDetailUiState()
}
```

One sealed class per screen. One `collect` in the Fragment or one `when` in the composable.

---

## Observer + State Together

The real power comes from combining them:

```kotlin
// ViewModel combines both patterns
val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()  // Observer
//                     ^^^^^^^^^^^^^
//                     Sealed class enforces valid states        // State
```

Observer ensures the UI always reflects the latest state. State ensures that latest state is always valid.

Result: **UI that never lies.**

---

## Next Up

[Part 3: Proxy & Facade →](./proxy-facade) — how to build a cache gate that's invisible to callers, and how to keep your ViewModels thin.
