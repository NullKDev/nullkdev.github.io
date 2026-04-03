---
title: "Getting Started with Remote Compose: A Practical Example"
description: "Step-by-step example of creating a Remote Compose document on the creation side and rendering it inside an Android app using remote-player-view."
date: 2026-04-01
tags: ["android", "kotlin", "compose", "jetpack"]
authors: ["me"]
lang: en
order: 2
---

In the [previous part](./index), we covered what Remote Compose is and why it exists. Now let's build something real — a simple UI document, serialize it, and render it in an Android app.

> **Alpha warning:** `androidx.compose.remote` is currently `1.0.0-alpha07`. The API surface is still changing. Code in this post reflects the alpha07 state.

---

## Project Setup

### Dependencies

Add the Remote Compose modules to your project. For a typical Android app that both creates and plays documents locally (useful for testing or widget scenarios), you need both sides:

```kotlin
// build.gradle.kts (app module)
dependencies {
    // Creation side — generates the document
    implementation("androidx.compose.remote:remote-creation:1.0.0-alpha07")
    implementation("androidx.compose.remote:remote-creation-compose:1.0.0-alpha07")

    // Player side — renders the document
    implementation("androidx.compose.remote:remote-player-core:1.0.0-alpha07")
    implementation("androidx.compose.remote:remote-player-view:1.0.0-alpha07")

    // Preview support during development
    debugImplementation("androidx.compose.remote:remote-tooling-preview:1.0.0-alpha07")
}
```

**minSdk**: Remote Compose requires minSdk 23 (as of alpha04). If your project targets lower, enable core library desugaring — the library uses Java 11 APIs since alpha06.

```kotlin
// build.gradle.kts (app module)
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

## The Creation Side: Building a Document

The creation API mirrors Compose composables but operates in a different composition scope — the `RemoteApplier`. Functions here don't draw to a Canvas; they build a serializable UI tree.

Think of it as writing a template that will be frozen and shipped to a device.

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
                text = "Hello from the server!",
                style = RemoteTextStyle.titleLarge()
            )

            RemoteSpacer(height = 12f)

            RemoteText(
                text = "This UI was defined outside the app and rendered locally by the player runtime.",
                style = RemoteTextStyle.bodyMedium()
            )

            RemoteSpacer(height = 24f)

            RemoteButton(
                onClick = RemoteAction.log("button_clicked"),
                modifier = remoteModifier().fillMaxWidth()
            ) {
                RemoteText(text = "Tap me")
            }
        }
    }
}
```

`RemoteCompose.capture { ... }` runs the creation block and returns a `ByteArray` — the serialized document. You can write this to disk, send it over HTTP, or pass it through IPC.

> **Key constraint:** You cannot call regular `@Composable` functions inside a `RemoteCompose.capture { }` block. The `RemoteApplier` enforces this at compile time.

---

## Simulating a Server Response

In a real production app, the document would come from a backend service. For this example, let's simulate it locally with a coroutine:

```kotlin
// In a ViewModel or repository
class DocumentRepository {
    suspend fun fetchWelcomeDocument(): ByteArray {
        // Simulate network delay
        delay(300)
        // In production: val response = httpClient.get("/ui/welcome")
        //                return response.body()
        return buildWelcomeDocument()
    }
}
```

The document is just bytes. You can cache it, store it in a database, or version it however your backend works.

---

## The Player Side: Rendering in a Fragment

`remote-player-view` provides `RemoteComposePlayerView` — a `View` (not a Composable) that accepts a document and renders it. You can embed it in any XML layout or in a Compose UI via `AndroidView`.

### Option A: Using it in XML Layout

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
                            // Show error UI
                        }
                    }
                }
            }
        }
    }
}
```

### Option B: Embedding in Compose via AndroidView

If your app is fully Compose-based:

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

## Handling Remote Actions

Buttons and interactive elements in the document can emit **RemoteActions** — named events that the host app handles. The document declares what to emit; the player surfaces them:

```kotlin
// When building the document:
RemoteButton(
    onClick = RemoteAction.named("navigate_to_details", mapOf("id" to "42"))
) { ... }

// In the host app, set an action listener on the player view:
player.setActionListener { action ->
    when (action.name) {
        "navigate_to_details" -> {
            val id = action.params["id"]
            findNavController().navigate(
                RemoteFragmentDirections.toDetails(id)
            )
        }
        "button_clicked" -> {
            analytics.track("remote_button_tapped")
        }
    }
}
```

This keeps business logic in the app where it belongs, while the document controls layout and content.

---

## The ViewModel

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
                .onFailure { _documentState.value = DocumentState.Error(it.message ?: "Unknown error") }
        }
    }

    fun retry() = loadDocument()
}
```

---

## What This Enables

With this setup, the UI that renders in `RemoteComposePlayerView` can be updated by changing what the server returns — **without any app update**. The user sees a different layout, different text, different button, on their next launch.

Practical use cases:
- **A/B testing UI variants** without deploying new builds
- **Feature flags** that show or hide UI sections
- **Widgets and tiles** (this is how Glance will work once migrated)
- **Dynamic onboarding flows** that the product team can iterate on independently

---

## What It Can't Do Yet

Being alpha07, there are real limitations:

- **No arbitrary composables** — you can only use what `remote-creation` exposes. No custom composables from your codebase.
- **No ViewModel scope** — the document is stateless. Any stateful logic lives in the host app and is communicated via `RemoteAction`.
- **No navigation** — the player renders a single document; navigation between screens is the host app's responsibility.
- **API breaks frequently** — every alpha release has changed something. Don't build production infrastructure on this until beta.

---

## What to Watch For

The trajectory is clear. As the public API surface stabilizes and Glance migration progresses, Remote Compose will become the standard way to build widgets, lock screen components, Wear OS tiles, and cross-process UIs. The pattern you learn here carries forward.

Keep an eye on:
- `remote-creation-jvm` — the server-side JVM module that will unlock true backend document generation
- Glance's migration roadmap to `remote-player`
- The alpha → beta transition, which will signal API stability

---

## Full Example on GitHub

The complete working example (ViewModel, Fragment, document builder, action listener) is available in the project's `examples/compose-remote-demo` directory.

---

## Resources

- [Remote Compose Releases](https://developer.android.com/jetpack/androidx/releases/compose-remote)
- [Glance Documentation](https://developer.android.com/jetpack/compose/glance)
- [Arman Chatikyan — Remote Compose: Back to the Future](https://medium.com/@chatikyan/remote-compose-back-to-the-future-454b8e824fad)
