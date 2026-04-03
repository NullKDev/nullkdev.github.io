---
title: "Primeros Pasos con Remote Compose: Un Ejemplo Práctico"
description: "Ejemplo paso a paso para crear un documento Remote Compose en el lado de creación y renderizarlo dentro de una app Android usando remote-player-view."
date: 2026-04-01
tags: ["android", "kotlin", "compose", "jetpack"]
authors: ["me"]
lang: es
order: 2
---

En la [parte anterior](./index) explicamos qué es Remote Compose y por qué existe. Ahora construimos algo real — un documento de UI simple, lo serializamos, y lo renderizamos en una app Android.

> **Advertencia alpha:** `androidx.compose.remote` está actualmente en `1.0.0-alpha07`. La superficie de la API sigue cambiando. El código de este post refleja el estado de alpha07.

---

## Configuración del Proyecto

### Dependencias

Agrega los módulos de Remote Compose. Para una app que crea y reproduce documentos localmente (útil para pruebas o widgets), necesitas ambos lados:

```kotlin
// build.gradle.kts (módulo app)
dependencies {
    // Lado de creación — genera el documento
    implementation("androidx.compose.remote:remote-creation:1.0.0-alpha07")
    implementation("androidx.compose.remote:remote-creation-compose:1.0.0-alpha07")

    // Lado del player — renderiza el documento
    implementation("androidx.compose.remote:remote-player-core:1.0.0-alpha07")
    implementation("androidx.compose.remote:remote-player-view:1.0.0-alpha07")

    // Preview durante desarrollo
    debugImplementation("androidx.compose.remote:remote-tooling-preview:1.0.0-alpha07")
}
```

**minSdk**: Remote Compose requiere minSdk 23 (desde alpha04). Si tu proyecto apunta a un nivel menor, habilita core library desugaring — la librería usa APIs de Java 11 desde alpha06.

```kotlin
android {
    compileOptions {
        isCoreLibraryDesugaringEnabled = true
    }
}
dependencies {
    coreLibraryDesugaring("com.android.tools.desugar_jdk_libs:2.1.4")
}
```

---

## El Lado de Creación: Construyendo un Documento

La API de creación espeja los composables de Compose pero opera en un scope de composición diferente — el `RemoteApplier`. Las funciones aquí no dibujan en un Canvas; construyen un árbol de UI serializable.

Piénsalo como escribir una plantilla que se congela y se envía al dispositivo.

```kotlin
import androidx.compose.remote.creation.RemoteCompose
import androidx.compose.remote.creation.compose.RemoteColumn
import androidx.compose.remote.creation.compose.RemoteText
import androidx.compose.remote.creation.compose.RemoteButton
import androidx.compose.remote.creation.compose.RemoteSpacer
import androidx.compose.remote.creation.compose.remoteModifier
import androidx.compose.remote.creation.compose.fillMaxWidth
import androidx.compose.remote.creation.compose.padding

fun buildWelcomeDocument(): ByteArray {
    return RemoteCompose.capture {
        RemoteColumn(
            modifier = remoteModifier()
                .fillMaxWidth()
                .padding(24f)
        ) {
            RemoteText(
                text = "¡Hola desde el servidor!",
                style = RemoteTextStyle.titleLarge()
            )

            RemoteSpacer(height = 12f)

            RemoteText(
                text = "Esta UI fue definida fuera de la app y renderizada localmente por el runtime del player.",
                style = RemoteTextStyle.bodyMedium()
            )

            RemoteSpacer(height = 24f)

            RemoteButton(
                onClick = RemoteAction.log("boton_presionado"),
                modifier = remoteModifier().fillMaxWidth()
            ) {
                RemoteText(text = "Presióname")
            }
        }
    }
}
```

`RemoteCompose.capture { ... }` ejecuta el bloque de creación y devuelve un `ByteArray` — el documento serializado. Puedes escribirlo en disco, enviarlo por HTTP, o pasarlo por IPC.

> **Restricción clave:** No puedes llamar funciones `@Composable` regulares dentro de un bloque `RemoteCompose.capture { }`. El `RemoteApplier` lo aplica en tiempo de compilación.

---

## Simulando una Respuesta del Servidor

En una app real en producción, el documento vendría de un servicio backend. Para este ejemplo, lo simulamos localmente con una coroutine:

```kotlin
// En un ViewModel o repositorio
class DocumentRepository {
    suspend fun fetchWelcomeDocument(): ByteArray {
        // Simular latencia de red
        delay(300)
        // En producción: val response = httpClient.get("/ui/welcome")
        //                return response.body()
        return buildWelcomeDocument()
    }
}
```

El documento es solo bytes. Puedes cachearlo, guardarlo en una base de datos, o versionarlo como quieras en tu backend.

---

## El Lado del Player: Renderizando en un Fragment

`remote-player-view` provee `RemoteComposePlayerView` — una `View` (no un Composable) que acepta un documento y lo renderiza. Puedes embebarlo en cualquier layout XML o en una UI Compose mediante `AndroidView`.

### Opción A: Usarlo en un Layout XML

```xml
<!-- res/layout/fragment_remote.xml -->
<FrameLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <androidx.compose.remote.player.view.RemoteComposePlayerView
        android:id="@+id/remote_player"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" />

    <ProgressBar
        android:id="@+id/loading"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:visibility="gone" />

</FrameLayout>
```

```kotlin
class RemoteFragment : Fragment(R.layout.fragment_remote) {

    private val viewModel: RemoteViewModel by viewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val player = view.findViewById<RemoteComposePlayerView>(R.id.remote_player)
        val loading = view.findViewById<ProgressBar>(R.id.loading)

        viewLifecycleOwner.lifecycleScope.launch {
            viewLifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
                viewModel.documentState.collect { state ->
                    when (state) {
                        is DocumentState.Loading -> {
                            loading.isVisible = true
                            player.isVisible = false
                        }
                        is DocumentState.Success -> {
                            loading.isVisible = false
                            player.isVisible = true
                            player.setDocument(state.bytes)
                        }
                        is DocumentState.Error -> {
                            loading.isVisible = false
                            // Mostrar UI de error
                        }
                    }
                }
            }
        }
    }
}
```

### Opción B: Embeber en Compose con AndroidView

Si tu app es completamente Compose:

```kotlin
@Composable
fun RemoteScreen(documentBytes: ByteArray?) {
    if (documentBytes == null) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
        return
    }

    AndroidView(
        factory = { context ->
            RemoteComposePlayerView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
            }
        },
        update = { playerView ->
            playerView.setDocument(documentBytes)
        },
        modifier = Modifier.fillMaxWidth()
    )
}
```

---

## Manejando Acciones Remotas

Los botones y elementos interactivos en el documento pueden emitir **RemoteActions** — eventos nombrados que la app anfitriona maneja. El documento declara qué emitir; el player los expone:

```kotlin
// Al construir el documento:
RemoteButton(
    onClick = RemoteAction.named("navegar_a_detalle", mapOf("id" to "42"))
) { ... }

// En la app anfitriona, establece un listener de acciones en el player view:
player.setActionListener { action ->
    when (action.name) {
        "navegar_a_detalle" -> {
            val id = action.params["id"]
            findNavController().navigate(
                RemoteFragmentDirections.toDetalle(id)
            )
        }
        "boton_presionado" -> {
            analytics.track("remote_boton_presionado")
        }
    }
}
```

Esto mantiene la lógica de negocio en la app donde pertenece, mientras el documento controla el layout y el contenido.

---

## El ViewModel

```kotlin
sealed interface DocumentState {
    data object Loading : DocumentState
    data class Success(val bytes: ByteArray) : DocumentState
    data class Error(val message: String) : DocumentState
}

class RemoteViewModel(
    private val repository: DocumentRepository
) : ViewModel() {

    private val _documentState = MutableStateFlow<DocumentState>(DocumentState.Loading)
    val documentState: StateFlow<DocumentState> = _documentState.asStateFlow()

    init {
        loadDocument()
    }

    private fun loadDocument() {
        viewModelScope.launch {
            _documentState.value = DocumentState.Loading
            runCatching { repository.fetchWelcomeDocument() }
                .onSuccess { _documentState.value = DocumentState.Success(it) }
                .onFailure { _documentState.value = DocumentState.Error(it.message ?: "Error desconocido") }
        }
    }

    fun reintentar() = loadDocument()
}
```

---

## Qué Habilita Esto

Con esta configuración, la UI que se renderiza en `RemoteComposePlayerView` puede actualizarse cambiando lo que devuelve el servidor — **sin ninguna actualización de la app**. El usuario ve un layout diferente, texto diferente, botón diferente, en su próximo inicio.

Casos de uso prácticos:
- **Tests A/B de variantes de UI** sin desplegar nuevos builds
- **Feature flags** que muestran u ocultan secciones de UI
- **Widgets y tiles** (así funcionará Glance una vez migrado)
- **Flujos de onboarding dinámicos** que el equipo de producto puede iterar de forma independiente

---

## Lo que Todavía No Puede Hacer

Al estar en alpha07, hay limitaciones reales:

- **Sin composables arbitrarios** — solo puedes usar lo que expone `remote-creation`. Sin composables personalizados de tu codebase.
- **Sin scope de ViewModel** — el documento es sin estado. Cualquier lógica con estado vive en la app anfitriona y se comunica vía `RemoteAction`.
- **Sin navegación** — el player renderiza un único documento; la navegación entre pantallas es responsabilidad de la app anfitriona.
- **La API cambia frecuentemente** — cada release alpha ha cambiado algo. No construyas infraestructura de producción sobre esto hasta llegar a beta.

---

## Qué Vigilar

La trayectoria es clara. A medida que la superficie de la API se estabilice y avance la migración de Glance, Remote Compose se convertirá en la forma estándar de construir widgets, componentes de pantalla de bloqueo, tiles de Wear OS, y UIs cross-process.

Presta atención a:
- `remote-creation-jvm` — el módulo JVM del lado servidor que habilitará generación real de documentos desde el backend
- El roadmap de migración de Glance a `remote-player`
- La transición alpha → beta, que señalará la estabilidad de la API

---

## Recursos

- [Lanzamientos de Remote Compose](https://developer.android.com/jetpack/androidx/releases/compose-remote)
- [Documentación de Glance](https://developer.android.com/jetpack/compose/glance)
- [Arman Chatikyan — Remote Compose: Volver al Futuro](https://medium.com/@chatikyan/remote-compose-back-to-the-future-454b8e824fad)
