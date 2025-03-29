  
    sequenceDiagram
      participant browser
      participant server
      
      browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note  Payload: note=test
      activate server
      server-->>browser: Redirect to /exampleapp/notes
      deactivate server
  
      browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
      activate server
      server-->>browser: HTML document
      deactivate server
  
      browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
      activate server
      server-->>browser: the css file
      deactivate server
  
      browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
      activate server
      server-->>browser: the JavaScript file
      deactivate server
  
      browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
      activate server
      server-->>browser: [{"content": "hi","date": "2025-03-29T08:01:05.423Z"}, ...]
      deactivate server
  
  


    
