import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private options = {
    headers: this.headers
  }
  connectionCode: string = "";

  constructor(private http: HttpClient){
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

  connect() {
    this.http
    .post("/api/connect", JSON.stringify({code: this.connectionCode}), this.options)
    .subscribe(data => { console.log(data); })
  }
}
