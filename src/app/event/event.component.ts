import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input("event-card") eventData;
  public amountValue;
  public personValue;
  eventPayments: Observable<any[]>;
  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    this.eventPayments = this.db.list('event/' + this.eventData.time + this.eventData.date + this.eventData.venue + '/payment').valueChanges()
  }
  createPayment(time, date, venue) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      // const eventRef = this.db.list('/event/'+time+ '' +date+ '' +venue+'/payment');
      const id = time + '' + date + '' + venue;
      const eventRef = this.db.list('/event/');
      eventRef.update(id,
        {
          personName: this.personValue,
          paidAmount: this.amountValue
        }
      );
    }
  }

  deleteEvent(time, date, venue) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user != null) {
      let id = time + '' + date + '' + venue;
      this.db.list('event/' + id).remove()
    }
  }

}
