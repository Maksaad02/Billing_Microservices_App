import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit{
  public products : any;
  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.http.get("http://localhost:8087/api/products").subscribe({
      next :data => {
        this.products = data
      },
      error : err => {
        console.log(err);
      }
    })
  }

}
