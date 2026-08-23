# Ollama setup

1. Install Ollama from [ollama.com](https://ollama.com/).
2. Start Ollama.
3. Download the default model once:

   ```powershell
   ollama pull qwen2.5:3b
   ```

4. Confirm it is available:

   ```powershell
   ollama list
   ```

The application defaults to:

```dotenv
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
```

Change `OLLAMA_MODEL` to any locally installed chat model. The UI reports separately when Ollama is down and when the selected model is missing. Automated tests mock Ollama and never require a downloaded model.

## Docker

When the application runs in Docker and Ollama runs on Windows, Compose uses `http://host.docker.internal:11434`. Ollama may need to listen beyond loopback depending on the installed version and host firewall policy. Do not expose Ollama to untrusted networks.

Models are intentionally not downloaded by Docker Compose because model downloads are large and should remain an explicit user action.
