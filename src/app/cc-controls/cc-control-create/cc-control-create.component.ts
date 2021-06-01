import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CcControl} from '../cc-control.model';
import {CcControlService} from '../cc-control.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {Company} from '../../companies/company.model';

@Component({
  selector: 'app-cc-control-create',
  templateUrl: './cc-control-create.component.html',
  styleUrls: ['./cc-control-create.component.css']
})
export class CcControlCreateComponent implements OnInit, OnDestroy {

  // 1. Datenbankabfrage, ob Betrieb bereits vorhanden
  // 2. wenn kein Ergebnis, dann Betrieb vom HIT abrufen und importieren
  // 3. wenn importiert, Datenbankabfrage, ob Betrieb jetzt vorhanden
  // 4. wenn vorhanden, CC-Kontrolle anlegen und aufrufen
  // 5. wenn angelegt, Bestandsregister vom HIT abrufen
  // 5.1 Daten (Rinder) vom HIT speichern
  // 6. Darstellung des Datums anpassen (Hilfsfunktionen zum konvertieren erstellen)
  // 6.1 CcControl und Cattle Model trennen und in eigene Datenbanken überführen
  // 7. CC-Kontrolle starten
  // TODO: 7.1 CaptureList erstellen mit CcControl._id und Cattle.lom & Cattle.lom5
  // 7.2 Datumsprobleme beseitigen
  // TODO: 8. Erfassen der Rinder über den Fünfsteller
  // 9. besondere Fälle bei der Erfassung berücksichtigen
  // TODO: 10. HIT-Anmeldedaten im Benutzerkonto speichern
  // TODO: 11. HIT-Benutzerdaten für den Datenabruf nutzen
  // TODO: 12. E-Mails versenden
  // TODO: 13. Auswertung der Kontrolle

  isLoading: any;
  ccControl: CcControl;
  form: FormGroup;
  dateFrom: string;
  dateTo: string;
  companies: Company[] = [];

  private authStatusSubscription: Subscription;

  constructor(
    public ccControlService: CcControlService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      dateFrom: new FormControl(null, {validators: [Validators.required]}),
      dateTo: new FormControl(),
      bnr: new FormControl(null, {validators: [Validators.required, Validators.pattern('^[0-9]{12,15}$')]})
    });
  }

  onSave(): void {
    if (this.form.invalid) { return; }
    const dateTo = (this.form.value.dateTo) ? this.form.value.dateTo : this.form.value.dateFrom;
    // TODO: Achtung Datum fehlerhaft!!!
    this.isLoading = true;
    this.ccControlService.add(this.form.value.bnr, this.form.value.dateFrom, dateTo);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSubscription.unsubscribe();
  }
}
