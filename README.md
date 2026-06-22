# SpringAiHelpdesk

AI-assisted helpdesk prototype with a Spring Boot (Spring AI) backend and a React + Vite frontend.

Quick start

- Backend (from project root):

  1. Ensure MySQL is running. Default config in `src/main/resources/application.yaml` uses `jdbc:mysql://localhost:3307/springai` with user `root`.
  2. Set environment variable for AI provider key (Windows PowerShell):

     ```powershell
     $env:SPRING_AI_APIKEY = 'your_api_key_here'
     ```

  3. Run the app:

     ```powershell
     cd SpringAiHelpdesk
     .\mvnw spring-boot:run
     ```

- Frontend:

  ```bash
  cd helpdesk_frontend
  npm install
  npm run dev
  ```

  Set `VITE_API_BASE_URL` in a `.env` file or environment to point to the backend (defaults to `http://localhost:8080`).

How to use

- Open the UI (Vite) — default `http://localhost:5173` — click "Start Getting Help".
- Left column contains multiple chat threads; each chat stores a separate `ConversationId` (localStorage) so the assistant can keep per-chat context.
- Type a prompt on the right, press Enter or click Send. Assistant replies stream into the chat in real time.

API endpoints

- `POST /api/v1/helpdesk` — body: plain text prompt, header `ConversationId`. Returns full assistant reply.
- `POST /api/v1/helpdesk/stream` — same inputs; returns a streaming response (used by frontend for progressive output).

Important notes

- CORS: when frontend and backend run on different origins, enable CORS on the backend or use the Vite dev proxy.
- Conversation IDs: frontend stores per-chat keys like `helpdesk_conversation_id_chat_<id>` in `localStorage` and sends them as the `ConversationId` header so Spring AI can maintain advisor memory per chat.
- Ticket operations are implemented as AI tools on the backend: see `TicketDatabaseTool.java` and `TicketService.java`.

Where to look

- Frontend chat UI: `helpdesk_frontend/src/pages/chat.jsx`
- Backend controller: `SpringAiHelpdesk/src/main/java/com/study/helpdesk/springaihelpdesk/controller/AiController.java`
- Backend AI service: `SpringAiHelpdesk/src/main/java/com/study/helpdesk/springaihelpdesk/service/AiService.java`

License

This repo is a personal prototype — add a license if you plan to publish it.

Technologies

- Java 25, Spring Boot 4
- Spring AI (spring-ai BOM + chat memory + OpenAI model connectors) used in the backend (`AiService`, `AiController`, `TicketDatabaseTool`)
- Reactor / Project Reactor (Flux streaming responses)
- MySQL (JDBC + Spring Data JPA)
- Maven build
- Frontend: React 19, Vite, Tailwind CSS + shadcn UI primitives
- Optional: OpenAI-compatible provider configured via `SPRING_AI_APIKEY` and `application.yaml`
