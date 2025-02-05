import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-import-start',
  standalone: true,
  imports: [],
  templateUrl: './import-start.component.html',
  styleUrl: './import-start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportStartComponent {}
