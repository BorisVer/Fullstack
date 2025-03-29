
    sequenceDiagram
      participant browser
      participant server

      Note: Same stays as in tehtava05.md
      
      browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa  
      activate server
      server-->>browser: Payload = {content: "heeei", date: "2025-03-29T19:57:16.664Z"}
      deactivate server
