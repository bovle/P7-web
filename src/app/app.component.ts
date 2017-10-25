import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  connectionCode: string = "";

  constructor(){
    /*console.log("hey");
    let socket = new WebSocket("ws://localhost:5000");
    socket.addEventListener('message', (event) => {
      console.log(event.data);
    });
    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({type: "message", message: "hello from angular"})
      );
      
    });*/
    
  }

  connectToSocket()
  {
    let socket = new WebSocket("ws://localhost:3000");
    socket.addEventListener('message', (event) => {
      console.log(event.data);
    });
    socket.addEventListener('open', () => {
      socket.send(
        JSON.stringify({type: "client_connection", payload: this.connectionCode})
      );
      
    });
  }


  
}
